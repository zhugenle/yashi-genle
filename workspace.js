if (!location.hash) history.replaceState(null, '', '#search');

const route = location.hash.startsWith('#topic/') ? 'topics' : location.hash.slice(1);
const currentLink = [...document.querySelectorAll('nav a[data-nav]')]
  .find(link => link.dataset.nav === route);
if (currentLink) {
  currentLink.setAttribute('aria-current', 'page');
  document.getElementById('page-label').textContent = currentLink.firstChild.textContent.trim();
}

document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  document.getElementById('app').focus();
});

const settings = window.ResearchPreferences.load();
if (settings.icon) {
  const icon = document.getElementById('site-icon');
  icon.type = 'image/png';
  icon.href = settings.icon;
  document.querySelector('.brand-symbol').src = settings.icon;
}

// Normalize only the workspace heading; preserve the archived content layout.
function alignWorkspaceHeading() {
  const heading = document.querySelector('#app > .page-heading');
  if (!heading) return;
  const title = heading.querySelector('h1');
  const english = heading.querySelector('.eyebrow');
  if (title && english) {
    english.classList.replace('eyebrow', 'english');
    title.after(english);
  }
}
new MutationObserver(alignWorkspaceHeading).observe(document.getElementById('app'), {childList:true});
alignWorkspaceHeading();
