import { defineConfig } from 'vitepress';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserSite = repository.endsWith('.github.io');
const base = repository && !isUserSite ? `/${repository}/` : '/';

export default defineConfig({
  title: 'Learning Docs',
  description: 'VitePress site for notes in the learning directory',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'Learning Docs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Engineering', link: '/learning/engineering/' },
      { text: 'English', link: '/learning/english/' }
    ],
    sidebar: {
      '/learning/engineering/': [
        {
          text: 'Engineering',
          items: [
            { text: 'Index', link: '/learning/engineering/' },
            { text: '00 Overview Index', link: '/learning/engineering/00-index' },
            { text: '01 Engineering Overview', link: '/learning/engineering/01-overview' },
            { text: '02 Vite', link: '/learning/engineering/02-vite' },
            { text: '03 Webpack', link: '/learning/engineering/03-webpack' },
            { text: '04 Babel and ESBuild', link: '/learning/engineering/04-babel-esbuild' },
            { text: '05 Code Splitting', link: '/learning/engineering/05-code-splitting' },
            { text: '06 Asset Optimization', link: '/learning/engineering/06-asset-optimization' },
            { text: '07 ESLint', link: '/learning/engineering/07-eslint' },
            { text: '08 Prettier', link: '/learning/engineering/08-prettier' },
            { text: '09 Husky', link: '/learning/engineering/09-husky' },
            { text: '10 lint-staged', link: '/learning/engineering/10-lint-staged' },
            { text: '11 Commit Rules', link: '/learning/engineering/11-commit-rules' },
            { text: '12 Testing', link: '/learning/engineering/12-testing' },
            { text: '13 CI-CD', link: '/learning/engineering/13-ci-cd' },
            { text: '14 Multi Env', link: '/learning/engineering/14-multi-env' },
            { text: '15 Feature Flag', link: '/learning/engineering/15-feature-flag' },
            { text: '16 Monorepo', link: '/learning/engineering/16-monorepo' },
            { text: '17 Team Governance', link: '/learning/engineering/17-team-governance' }
          ]
        }
      ],
      '/learning/english/': [
        {
          text: 'English',
          items: [
            { text: 'Index', link: '/learning/english/' },
            { text: '00 Study Index', link: '/learning/english/00-index' },
            { text: '01 Exercise Changes the Brain', link: '/learning/english/01-exercise-changes-brain' }
          ]
        }
      ]
    },
    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright Learning Docs'
    }
  }
});
