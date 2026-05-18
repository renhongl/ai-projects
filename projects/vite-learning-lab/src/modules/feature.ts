export function createLazyFeatureCard() {
  const section = document.createElement('section');
  section.className = 'feature-card';
  section.innerHTML = `
    <h3>动态导入已完成</h3>
    <p>这个模块不是首屏直接加载的，而是在点击按钮后才通过 import() 拉取。</p>
    <ul>
      <li>适合低频功能</li>
      <li>可以配合路由级拆包</li>
      <li>构建后通常会拆成独立 chunk</li>
    </ul>
  `;

  return section;
}
