import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(projectRoot, '..', '..');
const docsRoot = path.join(projectRoot, 'docs');

const zh = {
  engineeringDir: '\u5b66\u4e60\u5de5\u7a0b\u5316',
  englishDir: '\u5b66\u4e60\u82f1\u8bed',
  engineeringTitle: '\u5b66\u4e60\u5de5\u7a0b\u5316',
  englishTitle: '\u5b66\u4e60\u82f1\u8bed',
  engineeringIntro: '\u8fd9\u91cc\u6c47\u603b `learning/\u5b66\u4e60\u5de5\u7a0b\u5316` \u4e0b\u7684\u6587\u6863\u5185\u5bb9\u3002',
  englishIntro: '\u8fd9\u91cc\u6c47\u603b `learning/\u5b66\u4e60\u82f1\u8bed` \u4e0b\u7684\u6587\u6863\u5185\u5bb9\u3002',
  currentContent: '\u5f53\u524d\u5185\u5bb9'
};

const sections = [
  {
    sourceDir: path.join(repoRoot, 'learning', zh.engineeringDir),
    targetDir: path.join(docsRoot, 'learning', 'engineering'),
    indexTitle: zh.engineeringTitle,
    indexIntro: zh.engineeringIntro,
    items: [
      ['00-\u5de5\u7a0b\u5316\u5b66\u4e60\u7d22\u5f15.md', '00-index.md', '\u5de5\u7a0b\u5316\u5b66\u4e60\u7d22\u5f15'],
      ['01-\u5de5\u7a0b\u5316\u603b\u89c8.md', '01-overview.md', '\u5de5\u7a0b\u5316\u603b\u89c8'],
      ['02-Vite.md', '02-vite.md', 'Vite'],
      ['03-Webpack.md', '03-webpack.md', 'Webpack'],
      ['04-Babel\u4e0eESBuild.md', '04-babel-esbuild.md', 'Babel \u4e0e ESBuild'],
      ['05-\u4ee3\u7801\u5206\u5272\u4e0e\u6309\u9700\u52a0\u8f7d.md', '05-code-splitting.md', '\u4ee3\u7801\u5206\u5272\u4e0e\u6309\u9700\u52a0\u8f7d'],
      ['06-\u8d44\u6e90\u4f18\u5316\u4e0eTreeShaking.md', '06-asset-optimization.md', '\u8d44\u6e90\u4f18\u5316\u4e0e Tree Shaking'],
      ['07-ESLint.md', '07-eslint.md', 'ESLint'],
      ['08-Prettier.md', '08-prettier.md', 'Prettier'],
      ['09-Husky.md', '09-husky.md', 'Husky'],
      ['10-lint-staged.md', '10-lint-staged.md', 'lint-staged'],
      ['11-Commit\u89c4\u8303.md', '11-commit-rules.md', 'Commit \u89c4\u8303'],
      ['12-\u6d4b\u8bd5\u4f53\u7cfb.md', '12-testing.md', '\u6d4b\u8bd5\u4f53\u7cfb'],
      ['13-CI-CD.md', '13-ci-cd.md', 'CI/CD'],
      ['14-\u591a\u73af\u5883\u914d\u7f6e.md', '14-multi-env.md', '\u591a\u73af\u5883\u914d\u7f6e'],
      ['15-\u7070\u5ea6\u53d1\u5e03\u56de\u6eda\u4e0eFeatureFlag.md', '15-feature-flag.md', '\u7070\u5ea6\u53d1\u5e03\u56de\u6eda\u4e0e Feature Flag'],
      ['16-Monorepo\u4e0e\u811a\u624b\u67b6.md', '16-monorepo.md', 'Monorepo \u4e0e\u811a\u624b\u67b6'],
      ['17-\u5de5\u7a0b\u89c4\u8303\u4e0e\u56e2\u961f\u6cbb\u7406.md', '17-team-governance.md', '\u5de5\u7a0b\u89c4\u8303\u4e0e\u56e2\u961f\u6cbb\u7406']
    ]
  },
  {
    sourceDir: path.join(repoRoot, 'learning', zh.englishDir),
    targetDir: path.join(docsRoot, 'learning', 'english'),
    indexTitle: zh.englishTitle,
    indexIntro: zh.englishIntro,
    items: [
      ['00-\u82f1\u8bed\u5b66\u4e60\u7d22\u5f15.md', '00-index.md', '\u82f1\u8bed\u5b66\u4e60\u7d22\u5f15'],
      ['01-\u8fd0\u52a8\u6539\u53d8\u5927\u8111.md', '01-exercise-changes-brain.md', '\u8fd0\u52a8\u6539\u53d8\u5927\u8111']
    ]
  }
];

function transformContent(filename, content) {
  if (filename !== '02-Vite.md') {
    return content;
  }

  return content
    .replace(/\[[^\]]+\]\(<*\/D:\/FE\/ai-projects\/projects\/vite-learning-lab\/([^)>:]+)(?::\d+)?>\)/g, '`projects/vite-learning-lab/$1`')
    .replace(/\[[^\]]+\]\(\/D:\/FE\/ai-projects\/projects\/vite-learning-lab\/([^)#:]+)(?::\d+)?\)/g, '`projects/vite-learning-lab/$1`');
}

async function ensureCleanMarkdownDir(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

function buildSectionIndex(section) {
  const lines = [
    `# ${section.indexTitle}`,
    '',
    section.indexIntro,
    '',
    `## ${zh.currentContent}`,
    ''
  ];

  section.items.forEach(([, slugName, title], index) => {
    lines.push(`${index + 1}. [${title}](./${slugName.replace(/\.md$/, '')})`);
  });

  lines.push('');
  return lines.join('\n');
}

async function syncSection(section) {
  await ensureCleanMarkdownDir(section.targetDir);

  for (const [sourceName, targetName] of section.items) {
    const sourcePath = path.join(section.sourceDir, sourceName);
    const targetPath = path.join(section.targetDir, targetName);
    const content = await readFile(sourcePath, 'utf8');
    await writeFile(targetPath, transformContent(sourceName, content), 'utf8');
  }

  await writeFile(path.join(section.targetDir, 'index.md'), buildSectionIndex(section), 'utf8');
}

async function main() {
  for (const section of sections) {
    await syncSection(section);
  }

  process.stdout.write('Learning docs synced to VitePress docs.\n');
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
