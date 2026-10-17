const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const server = require('./dev-server.cjs');
const root = path.resolve(__dirname, '..');
const routes = ['', 'services', 'expertise', 'projects', 'research', 'publications', 'about', 'tools', 'contact'];
let origin;
before(async () => {
  await new Promise((resolve, reject) => {server.once('error', reject); server.listen(0, '127.0.0.1', resolve);});
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

test('every public route has a unique heading, metadata, and active navigation', async () => {
  const headings = new Set();
  for (const route of routes) {
    const response = await fetch(origin + '/' + (route ? route + '/' : ''));
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, route);
    const heading = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)[1];
    assert.ok(!headings.has(heading), route); headings.add(heading);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<meta name="description"/);
    assert.match(html, new RegExp(`href="/${route ? route + '/' : ''}" aria-current="page"`));
    assert.ok(!html.includes('{{'), 'Unresolved template token');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate ID on ${route}`);
  }
});

test('all internal page links and asset URLs resolve', async () => {
  for (const route of [...routes, 'dashboard', 'tool']) {
    const url = '/' + (route ? route + '/' : '');
    const html = await (await fetch(origin + url)).text();
    const base = html.includes('<base href="/">') ? origin + '/' : origin + url;
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = new URL(match[1].replaceAll('&amp;', '&'), base);
      if (target.origin !== origin) continue;
      if (target.hash && target.pathname === url) {
        assert.ok(html.includes(`id="${target.hash.slice(1)}"`), `${url}: ${target.hash}`);
      }
      const response = await fetch(target, {method:'HEAD'});
      assert.equal(response.status, 200, `${url} → ${target.pathname}`);
    }
  }
});

test('dashboard is isolated and preserves its controls and legacy entry point', async () => {
  const home = fs.readFileSync(path.join(root, 'index.html'),'utf8');
  assert.ok(!home.includes('admin.js'));
  assert.ok(!home.includes('/dashboard'));
  const dashboard = fs.readFileSync(path.join(root, 'dashboard/index.html'),'utf8');
  const script = fs.readFileSync(path.join(root, 'admin.js'),'utf8');
  for (const match of script.matchAll(/\$\('([^']+)'\)/g)) {
    assert.ok(dashboard.includes(`id="${match[1]}"`), match[1]);
  }
  const redirect = await fetch(origin+'/dashboard', {redirect:'manual'});
  assert.equal(redirect.status,301); assert.equal(redirect.headers.get('location'),'/dashboard/');
  assert.match(fs.readFileSync(path.join(root,'admin.html'),'utf8'), /location.search\+location.hash/);
});

test('project and publication content is readable without JavaScript', () => {
  const data = JSON.parse(fs.readFileSync(path.join(root,'content/portfolio-data.json'),'utf8'));
  const projects = fs.readFileSync(path.join(root,'projects/index.html'),'utf8');
  const pubs = fs.readFileSync(path.join(root,'publications/index.html'),'utf8');
  assert.equal([...projects.matchAll(/class="card project"/g)].length, data.projects.length);
  assert.equal([...pubs.matchAll(/class="card publication"/g)].length, data.publications.length);
});

test('project filters and publication searches preserve the full data set', () => {
  const elements = new Map();
  for (const id of ['projects','pub-results','pub-search','pub-type','pub-sort','pub-count','pub-empty','year']) {
    elements.set('#'+id,{value:'',textContent:'',innerHTML:'',classList:{toggle(){}},addEventListener(){}});
  }
  elements.get('#pub-type').value='All'; elements.get('#pub-sort').value='newest';
  const context=vm.createContext({document:{querySelector:s=>elements.get(s),querySelectorAll:()=>[]},window:{PORTFOLIO_CONFIG:{}},Date});
  vm.runInContext(fs.readFileSync(path.join(root,'public-data.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'public.js'),'utf8'),context);
  assert.equal((elements.get('#projects').innerHTML.match(/class="card project"/g)||[]).length,9);
  assert.equal(elements.get('#pub-count').textContent,'18 publications');
  vm.runInContext("renderProjects('Foundations')",context);
  assert.equal((elements.get('#projects').innerHTML.match(/class="card project"/g)||[]).length,2);
  elements.get('#pub-search').value='physics-informed'; vm.runInContext('renderPublications()',context);
  assert.equal(elements.get('#pub-count').textContent,'1 publication');
  elements.get('#pub-search').value='no-matching-publication'; vm.runInContext('renderPublications()',context);
  assert.equal(elements.get('#pub-count').textContent,'0 publications');
  elements.get('#pub-search').value=''; elements.get('#pub-type').value='Thesis'; vm.runInContext('renderPublications()',context);
  assert.equal(elements.get('#pub-count').textContent,'2 publications');
});

test('server returns correct types and rejects invalid requests', async () => {
  const css = await fetch(origin+'/pages.css'); assert.match(css.headers.get('content-type'), /text\/css/);
  const missing = await fetch(origin+'/not-a-page'); assert.equal(missing.status,404); assert.match(await missing.text(), /This page is off the map/);
  const hidden = await fetch(origin+'/.git/config'); assert.equal(hidden.status,404);
  const post = await fetch(origin+'/',{method:'POST'}); assert.equal(post.status,405);
  const malformed = await fetch(origin+'/%E0%A4%A'); assert.equal(malformed.status,400);
});
