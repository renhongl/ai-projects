import { defineConfig } from "vitepress";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repository.endsWith(".github.io");
const base = repository && !isUserSite ? `/${repository}/` : "/";

export default defineConfig({
  title: "Docs",
  description: "VitePress site for repository docs",
  lang: "zh-CN",
  base,
  cleanUrls: true,
  srcDir: "../",
  lastUpdated: true,
  themeConfig: {
    siteTitle: "Docs",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Front End",
        items: [
          {
            text: "Plan",
            link: "/plan/00-font-end-plan",
          },
          {
            text: "Engineering",
            link: "/engineering/",
          },
        ],
      },
      {
        text: "AI",
        items: [
          {
            text: "Agent",
            link: "/ai/01-agent",
          },
          {
            text: "Langchain",
            link: "/ai/02-langchain",
          },
        ],
      },
      {
        text: "TED",
        items: [
          {
            text: "The Brain-Changing Benefits of Exercise",
            link: "/english/01-exercise-changes-brain",
          },
        ],
      },
    ],
    sidebar: {
      "/engineering/": [
        {
          text: "Engineering",
          items: [
            { text: "Index", link: "/engineering/" },
            { text: "00 Overview Index", link: "/engineering/00-index" },
            {
              text: "01 Engineering Overview",
              link: "/engineering/01-overview",
            },
            { text: "02 Vite", link: "/engineering/02-vite" },
            { text: "03 Webpack", link: "/engineering/03-webpack" },
            {
              text: "04 Babel and ESBuild",
              link: "/engineering/04-babel-esbuild",
            },
            {
              text: "05 Code Splitting",
              link: "/engineering/05-code-splitting",
            },
            {
              text: "06 Asset Optimization",
              link: "/engineering/06-asset-optimization",
            },
            { text: "07 ESLint", link: "/engineering/07-eslint" },
            { text: "08 Prettier", link: "/engineering/08-prettier" },
            { text: "09 Husky", link: "/engineering/09-husky" },
            { text: "10 lint-staged", link: "/engineering/10-lint-staged" },
            { text: "11 Commit Rules", link: "/engineering/11-commit-rules" },
            { text: "12 Testing", link: "/engineering/12-testing" },
            { text: "13 CI-CD", link: "/engineering/13-ci-cd" },
            { text: "14 Multi Env", link: "/engineering/14-multi-env" },
            { text: "15 Feature Flag", link: "/engineering/15-feature-flag" },
            { text: "16 Monorepo", link: "/engineering/16-monorepo" },
            {
              text: "17 Team Governance",
              link: "/engineering/17-team-governance",
            },
          ],
        },
      ],
      "/plan/": [
        {
          text: "Plan",
          items: [
            { text: "00 Front End Plan", link: "/plan/00-font-end-plan" },
          ],
        },
      ],
      "/ai/": [
        {
          text: "Agent",
          link: "/ai/01-agent",
        },
        {
          text: "LangChain",
          link: "/ai/02-langchain",
        },
      ],
      "/english/": [
        {
          text: "TED",
          items: [
            {
              text: "01 Exercise Changes the Brain",
              link: "/english/01-exercise-changes-brain",
            },
          ],
        },
      ],
    },
    footer: {
      message: "Built with VitePress",
      copyright: "Copyright Doc Website",
    },
  },
});
