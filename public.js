// Data is generated from content/portfolio-data.json by npm run build.
const { projects, publications } = window.PORTFOLIO_DATA;

const projectBox = document.querySelector('#projects');
function renderProjects(filter){
  if(!projectBox) return;
  const visible = projects.filter(item => filter === 'All' || item.cat === filter);
  projectBox.innerHTML = visible.map(item => `
    <article class="card project">
      <div class="category">${item.cat}</div>
      <h2>${item.name}</h2>
      <p>${item.text}</p>
      <div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    </article>
  `).join('');
}
renderProjects('All');
document.querySelectorAll('.filter').forEach(el => el.setAttribute('aria-pressed', String(el.classList.contains('active'))));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(el => el.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.filter').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  renderProjects(button.dataset.filter);
}));

const pubResults = document.querySelector('#pub-results');
const pubSearch = document.querySelector('#pub-search');
const pubType = document.querySelector('#pub-type');
const pubSort = document.querySelector('#pub-sort');
const pubCount = document.querySelector('#pub-count');
const pubEmpty = document.querySelector('#pub-empty');

function publicationMatches(pub, term){
  if(!term) return true;
  const haystack = [pub.title, pub.authors, pub.venue, pub.type, String(pub.year)].join(' ').toLowerCase();
  return haystack.includes(term.toLowerCase());
}

function renderPublications(){
  if(!pubResults) return;
  const term = pubSearch?.value?.trim() || '';
  const type = pubType?.value || 'All';
  const sort = pubSort?.value || 'newest';

  let filtered = publications.filter(pub => publicationMatches(pub, term) && (type === 'All' || pub.type === type));

  if(sort === 'newest') filtered.sort((a,b) => b.year - a.year || a.title.localeCompare(b.title));
  if(sort === 'oldest') filtered.sort((a,b) => a.year - b.year || a.title.localeCompare(b.title));
  if(sort === 'title') filtered.sort((a,b) => a.title.localeCompare(b.title));

  pubCount.textContent = `${filtered.length} publication${filtered.length === 1 ? '' : 's'}`;
  pubResults.innerHTML = filtered.map(pub => `
    <article class="card publication">
      <div class="publication-meta">
        <span class="topline">${pub.year} · ${pub.venue}</span>
        <span class="status alt-status">${pub.type}</span>
      </div>
      <h2>${pub.title}</h2>
      <p>${pub.authors}</p>
      <a class="mini-link" target="_blank" rel="noopener noreferrer" href="${pub.url}">View publication ↗</a>
    </article>
  `).join('');

  pubEmpty.classList.toggle('hidden', filtered.length !== 0);
}

[pubSearch, pubType, pubSort].forEach(el => el && el.addEventListener('input', renderPublications));
[pubType, pubSort].forEach(el => el && el.addEventListener('change', renderPublications));
renderPublications();

const yearLabel = document.querySelector('#year');
if (yearLabel) yearLabel.textContent = new Date().getFullYear();

const cfg = window.PORTFOLIO_CONFIG || {};
if(document.querySelector('#public-apps') && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && cfg.PUBLIC_OWNER_ID && window.supabase){
  const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  db.from('portfolio_apps')
    .select('id,title,description,category,url,kind')
    .eq('owner_id', cfg.PUBLIC_OWNER_ID)
    .eq('published', true)
    .order('created_at', {ascending:false})
    .then(({data,error}) => {
      if(error) {
        const empty = document.querySelector('#public-apps .empty');
        if (empty) empty.textContent = 'The tool gallery could not be loaded. Please refresh to try again.';
        return;
      }
      if(!data?.length) return;
      const holder = document.querySelector('#public-apps');
      holder.replaceChildren();
      for(const app of data){
        const card = document.createElement('article');
        card.className = 'card app-public-card';
        const cat = document.createElement('div');
        cat.className = 'topline';
        cat.textContent = app.category || 'App';
        const h = document.createElement('h2');
        h.textContent = app.title;
        const p = document.createElement('p');
        p.textContent = app.description || 'Explore this tool.';
        const link = document.createElement('a');
        link.className = 'btn small';
        if(app.kind === 'link' && /^https:\/\//i.test(app.url || '')){
          link.href = app.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Open app ↗';
        } else {
          link.href = '/tool/?id=' + encodeURIComponent(app.id);
          link.textContent = 'Launch demo ↗';
        }
        card.append(cat, h, p, link);
        holder.append(card);
      }
    });
}
