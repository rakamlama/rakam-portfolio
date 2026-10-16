const projects = [
  {cat:'Foundations',name:'Massport Logan Airport · Boston',text:'Geotechnical evaluation, deep foundation design, 3D numerical analysis, and construction-stage pile assessment in very soft soils.',tags:['PLAXIS 3D','Foundation systems','2025']},
  {cat:'Infrastructure',name:'Still Run Bridge · West Virginia',text:'Technical design reviews for drilled shaft bridge foundations and reinforced soil slopes on a major highway bridge.',tags:['Drilled shafts','Bridge design','2025–26']},
  {cat:'Geo-structural',name:'Canal Street Excavation Support · NYC',text:'Engineering of phased excavation support systems combining sheet piles, jet grouting, and soldier piles around active utilities.',tags:['Excavation support','Jet grouting','2020–24']},
  {cat:'Digital',name:'Pile Installation Intelligence',text:'Python-based workflow and interactive dashboard for pile capacity, depth, installation progress, and anomaly detection.',tags:['Python','Unsupervised ML','Dashboard']},
  {cat:'Infrastructure',name:'Lower Passaic River · New Jersey',text:'Field investigations and geo-structural assessments associated with complex sediment remediation and shoreline infrastructure.',tags:['Marine geotechnics','Remediation']},
  {cat:'Digital',name:'Transmission Tower Soil Profiles',text:'Python automation to calculate foundation design parameters and generate consistent soil profiles for transmission infrastructure.',tags:['Python','Automation','Transmission']},
  {cat:'Foundations',name:'Foxfield Industrial Development · Tennessee',text:'Geotechnical evaluation for difficult fill and variable rock conditions with ground improvement and hybrid foundation recommendations.',tags:['Karst','Ground improvement','2026']},
  {cat:'Infrastructure',name:'VDOT I-64 / I-464 · Virginia',text:'Technical review of ground improvement, settlement, foundation design, and geotechnical considerations for roadway improvements.',tags:['Transportation','Settlement']},
  {cat:'Geo-structural',name:'Historic Bridge Foundation Retrofit · New York',text:'Jet grouting design, instrumentation planning, and construction oversight for foundation strengthening at a historic bridge.',tags:['Jet grouting','Instrumentation']}
];

const publications = [
  {"year": 2026, "type": "Journal article", "venue": "Acta Geotechnica", "title": "Physics-informed neural network for the simulation of turbulent jet grout flow", "authors": "Rakam Lama Tamang, Yichuan Zhu, Joseph Coe", "url": "https://doi.org/10.1007/s11440-026-02979-7"},
  {"year": 2026, "type": "Thesis", "venue": "Doctoral thesis", "title": "Artificial intelligence approaches to jet grouting column diameter prediction", "authors": "Rakam Lama Tamang", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2025, "type": "Journal article", "venue": "Geodata and AI", "title": "Transformer-Based Model for Predicting Jet Grout Column Diameter", "authors": "Rakam Lama Tamang, Yichuan Zhu, Joseph Coe", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2025, "type": "Conference paper", "venue": "Conference proceedings", "title": "Bayesian Uncertainty Quantification and Optimization of Jet Grout Column Diameter Prediction", "authors": "Rakam Lama Tamang, Yichuan Zhu, Joseph Coe", "url": "https://doi.org/10.1061/9780784485989.039"},
  {"year": 2024, "type": "Journal article", "venue": "Computers and Geotechnics", "title": "Bayesian deep learning for uncertainty quantification and prediction of jet grout column diameter", "authors": "Rakam Lama Tamang, Yichuan Zhu, Joseph Coe", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2024, "type": "Conference paper", "venue": "Conference proceedings", "title": "Performance of Machine Learning Algorithms for Predicting Jet Grout Column Diameter", "authors": "Rakam Lama Tamang, Joseph Coe", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2023, "type": "Conference paper", "venue": "Conference proceedings", "title": "Risk Assessment and Avoidance for Impact of Dredging on Existing Shoreline Structures", "authors": "Rakam Lama Tamang, Michael Byle, Senda Ozkan", "url": "https://doi.org/10.1061/9780784484982.039"},
  {"year": 2023, "type": "Conference paper", "venue": "Conference proceedings", "title": "ORIENTED JET GROUTING ‘M’ SUPPORTS FOR UNDERPINNING HISTORICAL FOUNDATIONS", "authors": "Michael Byle, Rakam Lama Tamang", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2021, "type": "Conference paper", "venue": "Conference proceedings", "title": "A Case History of Bulkhead Design and Construction for Environmental Dredging and Soil Retention", "authors": "Michael Byle, Rakam Lama Tamang", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2020, "type": "Conference paper", "venue": "Conference proceedings", "title": "Adaptive Slope Stabilization for River Remediation", "authors": "Michael Byle, Rakam Lama Tamang", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2019, "type": "Conference paper", "venue": "Conference proceedings", "title": "Slope Stabilization for River Remediation", "authors": "Rakam Lama Tamang, Michael Byle", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2019, "type": "Journal article", "venue": "Journal article", "title": "Effect of Plasticity on Liquefaction of a Selected Fine-Grained Soil", "authors": "Sandip Uprety, Vijay K. Puri, Rakam Lama Tamang, Prabir K. Kolay", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2019, "type": "Conference paper", "venue": "Conference proceedings", "title": "Effect of Plasticity on Liquefaction of a Selected Fine-Grained Soil", "authors": "Sandip Uprety, Vijay Puri, Rakam Lama Tamang, Prabir K. Kolay", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2019, "type": "Journal article", "venue": "International Journal of Geosynthetics and Ground Engineering", "title": "Effects of Fly Ash on Liquefaction Characteristics of Ottawa Sand", "authors": "Prabir K. Kolay, V. K. Puri, Rakam Lama Tamang, and co-authors", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2017, "type": "Conference paper", "venue": "Conference proceedings", "title": "Assessment of Existing Bulkhead Walls for Dredging Impacts", "authors": "Michael Byle, Rakam Lama Tamang, Stephan Ertnst", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2017, "type": "Conference paper", "venue": "Conference proceedings", "title": "Geotechnical Investigation in Extreme Terrain", "authors": "Rakam Lama Tamang, Michael Byle", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2015, "type": "Conference paper", "venue": "Conference proceedings", "title": "Liquefaction Potential of Sand-Fly Ash Mixtures", "authors": "V. K. Puri, Rakam Lama Tamang, Sanjeev Kumar, and co-authors", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
  {"year": 2014, "type": "Thesis", "venue": "Master’s thesis", "title": "Effect of Addition of Small Percentages of Fly Ash on Liquefaction Characteristics of Sand", "authors": "Rakam Lama Tamang", "url": "https://www.researchgate.net/profile/Rakam-Lama-Tamang"},
];

const projectBox = document.querySelector('#projects');
function renderProjects(filter){
  if(!projectBox) return;
  const visible = projects.filter(item => filter === 'All' || item.cat === filter);
  projectBox.innerHTML = visible.map(item => `
    <article class="card project">
      <div class="category">${item.cat}</div>
      <h3>${item.name}</h3>
      <p>${item.text}</p>
      <div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    </article>
  `).join('');
}
renderProjects('All');
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(el => el.classList.remove('active'));
  button.classList.add('active');
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
      <h3>${pub.title}</h3>
      <p>${pub.authors}</p>
      <a class="mini-link" target="_blank" rel="noopener noreferrer" href="${pub.url}">View publication ↗</a>
    </article>
  `).join('');

  pubEmpty.classList.toggle('hidden', filtered.length !== 0);
}

[pubSearch, pubType, pubSort].forEach(el => el && el.addEventListener('input', renderPublications));
[pubType, pubSort].forEach(el => el && el.addEventListener('change', renderPublications));
renderPublications();

document.querySelector('#year').textContent = new Date().getFullYear();

const cfg = window.PORTFOLIO_CONFIG || {};
if(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && cfg.PUBLIC_OWNER_ID && window.supabase){
  const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  db.from('portfolio_apps')
    .select('id,title,description,category,url,kind')
    .eq('owner_id', cfg.PUBLIC_OWNER_ID)
    .eq('published', true)
    .order('created_at', {ascending:false})
    .then(({data,error}) => {
      if(error || !data?.length) return;
      const holder = document.querySelector('#public-apps');
      holder.replaceChildren();
      for(const app of data){
        const card = document.createElement('article');
        card.className = 'card app-public-card';
        const cat = document.createElement('div');
        cat.className = 'topline';
        cat.textContent = app.category || 'App';
        const h = document.createElement('h3');
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
          link.href = 'tool.html?id=' + encodeURIComponent(app.id);
          link.textContent = 'Launch demo ↗';
        }
        card.append(cat, h, p, link);
        holder.append(card);
      }
    });
}
