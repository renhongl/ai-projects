import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFilePath), '..', '..');
const workspaceRoots = ['projects', 'packages', 'tooling'];
const packageJsonFiles = [];
const issues = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name === '.vite' ||
      entry.name === '.vitepress'
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name === 'package.json') {
      packageJsonFiles.push(fullPath);
    }
  }
}

for (const workspaceRoot of workspaceRoots) {
  const fullPath = path.join(rootDir, workspaceRoot);
  if (fs.existsSync(fullPath)) {
    walk(fullPath);
  }
}

for (const file of packageJsonFiles) {
  const relativePath = path.relative(rootDir, file);
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const scripts = manifest.scripts ?? {};

  if (!manifest.name) {
    issues.push(`${relativePath}: missing package name`);
  }

  if (manifest.private !== true) {
    issues.push(`${relativePath}: expected "private": true for this learning workspace`);
  }

  for (const scriptName of ['build', 'test', 'lint']) {
    if (!(scriptName in scripts)) {
      issues.push(`${relativePath}: missing recommended script "${scriptName}"`);
    }
  }
}

if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
  issues.push('package-lock.json should not coexist with pnpm-lock.yaml in this workspace');
}

if (issues.length === 0) {
  console.log(`workspace-doctor: OK (${packageJsonFiles.length} workspace packages checked)`);
  process.exit(0);
}

console.error('workspace-doctor: found issues');
for (const issue of issues) {
  console.error(`- ${issue}`);
}
process.exit(1);
