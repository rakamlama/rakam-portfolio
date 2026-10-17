const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const routes = ['home', 'services', 'expertise', 'projects', 'research', 'publications', 'about', 'tools', 'contact'];
const labels = {home:'Home', services:'Services', expertise:'Expertise', projects:'Projects', research:'Research', publications:'Publications', about:'About', tools:'Tools', contact:'Contact'};
const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/portfolio-data.json'), 'utf8'));
fs.writeFileSync(path.join(root, 'public-data.js'), 'window.PORTFOLIO_DATA = ' + JSON.stringify(data) + ';\n');
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const urlFor = route => route === 'home' ? '/' : `/${route}/`;
for (const route of routes) {
  const meta = JSON.parse(fs.readFileSync(path.join(root, `content/${route}.json`), 'utf8'));
  let content = fs.readFileSync(path.join(root, `content/${route}.html`), 'utf8');
  if (route === 'projects') {
    const cards = data.projects.map(item => `<article class="card project"><div class="category">${escape(item.cat)}</div><h2>${escape(item.name)}</h2><p>${escape(item.text)}</p><div class="tags">${item.tags.map(tag => `<span class="tag">${escape(tag)}</span>`).join('')}</div></article>`).join('');
    content = content.replace('<div class="grid" id="projects"></div>', `<div class="grid" id="projects">${cards}</div>`);
  }
  if (route === 'publications') {
    const publications = [...data.publications].sort((a,b) => b.year - a.year || a.title.localeCompare(b.title));
    const cards = publications.map(pub => `<article class="card publication"><div class="publication-meta"><span class="topline">${pub.year} · ${escape(pub.venue)}</span><span class="status alt-status">${escape(pub.type)}</span></div><h2>${escape(pub.title)}</h2><p>${escape(pub.authors)}</p><a class="mini-link" href="${escape(pub.url)}" target="_blank" rel="noopener noreferrer">View publication ↗</a></article>`).join('');
    content = content.replace(/(<div class="publication-list" id="pub-results">).*?(<\/div>)/s, '$1' + cards + '$2');
    content = content.replace(/(<strong id="pub-count"[^>]*>).*?(<\/strong>)/s, '$1' + publications.length + ' publications$2');
  }
  // Dedicated pages own their heading; content sections retain semantic subheadings.
  const intro = route === 'home' ? '' : `<header class="page-intro"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escape(meta.label)}</span></nav><div class="intro-layout"><div><div class="eyebrow">${escape(meta.label)}</div><h1>${escape(meta.title)}</h1></div><p>${escape(meta.description)}</p></div></div></header>`;
  const cta = route === 'contact' ? '' : `<section class="closing-cta"><div class="wrap"><div><div class="eyebrow">Connect & collaborate</div><h2>Bring a new perspective<br>to your next challenge.</h2></div><a class="btn" href="/contact/">Let’s start a conversation ↗</a></div></section>`;
  const navigation = routes.map(item => `<a href="${urlFor(item)}"${item === route ? ' aria-current="page"' : ''}>${labels[item]}</a>`).join('\n');
  // Keep the portrait and visual refinements exclusive to the homepage.
  let scripts = route === 'home' ? '<link rel="stylesheet" href="/home.css">' : '';
  if (['projects','publications','tools'].includes(route)) scripts = '<script defer src="/public-data.js"></script><script defer src="/public.js"></script>';
  if (route === 'tools') scripts = '<script defer src="/app-config.js"></script><script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>' + scripts;
  const values = {title:escape(meta.title),description:escape(meta.description),canonical:'https://rakamtamang.com'+urlFor(route),route,navigation,scripts,intro,content,cta};
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]);
  const directory = route === 'home' ? root : path.join(root,route);
  fs.mkdirSync(directory,{recursive:true});
  fs.writeFileSync(path.join(directory,'index.html'),html.split('\n').map(line => line.trimEnd()).join('\n'));
}
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>https://rakamtamang.com${urlFor(route)}</loc></url>`).join('')}</urlset>\n`);
console.log(`Generated ${routes.length} pages and sitemap.`);

const missing = {
  title: 'Page not found', description: 'The requested page could not be found.',
  canonical: 'https://rakamtamang.com/404.html', route: '404',
  navigation: routes.map(route => `<a href="${urlFor(route)}">${labels[route]}</a>`).join(''),
  scripts: '', intro: '', cta: '',
  content: '<section><div class="wrap"><div class="eyebrow">404 · A different direction</div><h1>This page is off the map.</h1><p>The address may have changed. Explore the site or return to the homepage.</p><div class="actions"><a class="btn primary" href="/">Back to home →</a><a class="btn" href="/contact/">Get in touch ↗</a></div></div></section>'
};
fs.writeFileSync(path.join(root, '404.html'), template.replace(/\{\{(\w+)\}\}/g, (_, key) => missing[key]));

const viewer = {
  title: 'Engineering tool', description: 'Explore a published engineering application.',
  canonical: 'https://rakamtamang.com/tool/', route: 'tool',
  navigation: routes.map(route => `<a href="${urlFor(route)}"${route === 'tools' ? ' aria-current="page"' : ''}>${labels[route]}</a>`).join(''),
  scripts: '<script defer src="/app-config.js"></script><script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script><script defer src="/tool.js"></script>',
  intro: '', cta: '', content: fs.readFileSync(path.join(root, 'content/tool-viewer.html'), 'utf8')
};
fs.mkdirSync(path.join(root, 'tool'), {recursive: true});
fs.writeFileSync(path.join(root, 'tool/index.html'), template.replace(/\{\{(\w+)\}\}/g, (_, key) => viewer[key]).replace('<meta name="theme-color"', '<meta name="robots" content="noindex"><meta name="theme-color"'));
