const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navlinks');
function closeMenu() {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation?.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
// Preserve existing shared links from the former single-page portfolio.
const legacyRoutes = {expertise:'expertise',work:'projects',research:'research',publications:'publications',about:'about',tools:'tools',contact:'contact'};
if (location.pathname === '/' || location.pathname === '/index.html') {
  const route = legacyRoutes[location.hash.slice(1)];
  if (route) location.replace('/' + route + '/');
}
