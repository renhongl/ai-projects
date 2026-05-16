import './style.css';
import viteMarkUrl from '@/assets/vite-mark.svg';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App container #app was not found.');
}

const envSummary = [
  ['MODE', import.meta.env.MODE],
  ['DEV', String(import.meta.env.DEV)],
  ['PROD', String(import.meta.env.PROD)],
  ['BASE_URL', import.meta.env.BASE_URL],
  ['VITE_APP_TITLE', import.meta.env.VITE_APP_TITLE],
  ['VITE_API_BASE', import.meta.env.VITE_API_BASE]
]
  .map(([key, value]) => `<li><strong>${key}</strong>: ${value}</li>`)
  .join('');

app.innerHTML = `
  <main class="page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Engineering Learning</p>
        <h1>${import.meta.env.VITE_APP_TITLE}</h1>
        <p class="lead">
          This lab keeps the dependency surface small and focuses on core Vite concepts:
          dev server, env variables, path aliases, static assets, the public directory,
          dynamic import, and production build output.
        </p>
        <div class="actions">
          <button id="load-feature" class="primary-button">Load Lazy Feature</button>
          <a class="secondary-link" href="/robots.txt" target="_blank" rel="noreferrer">
            Open public/robots.txt
          </a>
        </div>
      </div>
      <div class="hero-panel">
        <img class="hero-logo" src="${viteMarkUrl}" alt="Vite logo" />
        <h2>Current Environment</h2>
        <ul class="env-list">${envSummary}</ul>
      </div>
    </section>

    <section class="notes">
      <article>
        <h3>src/assets</h3>
        <p>Assets in this folder are processed by Vite and participate in the build pipeline.</p>
      </article>
      <article>
        <h3>Alias</h3>
        <p>The project uses <code>@</code> as an alias to <code>src</code> to keep imports shallow.</p>
      </article>
      <article>
        <h3>Proxy</h3>
        <p>During development, requests under <code>/api</code> can be forwarded to a local backend.</p>
      </article>
    </section>

    <section id="lazy-slot"></section>
  </main>
`;

const loadButton = document.querySelector<HTMLButtonElement>('#load-feature');
const lazySlot = document.querySelector<HTMLElement>('#lazy-slot');

loadButton?.addEventListener('click', () => {
  void (async () => {
    if (!lazySlot) {
      return;
    }

    const { createLazyFeatureCard } = await import('@/modules/feature');
    lazySlot.replaceChildren(createLazyFeatureCard());
    loadButton.disabled = true;
    loadButton.textContent = 'Lazy Feature Loaded';
  })();
});
