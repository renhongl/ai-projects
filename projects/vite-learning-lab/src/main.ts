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
          这个项目用最少依赖演示 Vite 的核心能力：开发服务器、环境变量、别名、静态资源、
          public 目录、动态导入与构建输出。
        </p>
        <div class="actions">
          <button id="load-feature" class="primary-button">加载动态模块</button>
          <a class="secondary-link" href="/robots.txt" target="_blank" rel="noreferrer">
            查看 public/robots.txt
          </a>
        </div>
      </div>
      <div class="hero-panel">
        <img class="hero-logo" src="${viteMarkUrl}" alt="Vite logo" />
        <h2>当前环境</h2>
        <ul class="env-list">${envSummary}</ul>
      </div>
    </section>

    <section class="notes">
      <article>
        <h3>src/assets</h3>
        <p>这里的资源会被 Vite 识别、处理并参与构建。</p>
      </article>
      <article>
        <h3>路径别名</h3>
        <p>项目使用 <code>@</code> 指向 <code>src</code>，减少相对路径层级。</p>
      </article>
      <article>
        <h3>代理配置</h3>
        <p>开发环境可将 <code>/api</code> 转发到本地后端，避免前端直连跨域。</p>
      </article>
    </section>

    <section id="lazy-slot"></section>
  </main>
`;

const loadButton = document.querySelector<HTMLButtonElement>('#load-feature');
const lazySlot = document.querySelector<HTMLElement>('#lazy-slot');

loadButton?.addEventListener('click', async () => {
  if (!lazySlot) {
    return;
  }

  const { createLazyFeatureCard } = await import('@/modules/feature');
  lazySlot.replaceChildren(createLazyFeatureCard());
  loadButton.disabled = true;
  loadButton.textContent = '动态模块已加载';
});
