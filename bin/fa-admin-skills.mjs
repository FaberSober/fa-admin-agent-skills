#!/usr/bin/env node

import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_ROOT = process.cwd();
const TARGET_ROOT = join(PROJECT_ROOT, '.agents', 'skills');
const LOCK_FILE = join(PROJECT_ROOT, '.agents', 'skills.lock.json');
const MARKER_FILE = '.fa-admin-skill.json';

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function readJsonIfExists(path) {
  try {
    return await readJson(path);
  } catch {
    return null;
  }
}

async function hashDirectory(root) {
  const hash = createHash('sha256');

  async function visit(directory, prefix = '') {
    const entries = await readdir(directory, { withFileTypes: true });

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (prefix === '' && entry.name === MARKER_FILE) {
        continue;
      }

      const currentPath = join(directory, entry.name);
      const relativePath = prefix
        ? join(prefix, entry.name)
        : entry.name;

      if (entry.isDirectory()) {
        await visit(currentPath, relativePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      hash.update(relativePath.split(sep).join('/') + '\0');
      hash.update(await readFile(currentPath));
    }
  }

  await visit(root);
  return hash.digest('hex');
}

async function loadPackage() {
  const packageJson = await readJson(join(PACKAGE_ROOT, 'package.json'));
  const manifest = await readJson(join(PACKAGE_ROOT, 'manifest.json'));

  if (!Array.isArray(manifest.skills)) {
    throw new Error('manifest.json 的 skills 必须是数组');
  }

  const names = new Set();

  for (const skill of manifest.skills) {
    if (!skill.name || !skill.path) {
      throw new Error('manifest.json 中存在缺少 name 或 path 的 Skill');
    }

    if (names.has(skill.name)) {
      throw new Error(`Skill 重复定义：${skill.name}`);
    }

    if (skill.name.includes('/') || skill.name.includes('\\')) {
      throw new Error(`Skill 名称不能包含路径分隔符：${skill.name}`);
    }

    names.add(skill.name);

    const sourcePath = resolve(PACKAGE_ROOT, skill.path);
    const packagePrefix = `${PACKAGE_ROOT}${sep}`;

    if (!sourcePath.startsWith(packagePrefix)) {
      throw new Error(`Skill 路径越界：${skill.path}`);
    }

    if (!(await isDirectory(sourcePath))) {
      throw new Error(`Skill 目录不存在：${sourcePath}`);
    }

    if (!(await exists(join(sourcePath, 'SKILL.md')))) {
      throw new Error(`Skill 缺少 SKILL.md：${sourcePath}`);
    }
  }

  return { packageJson, manifest };
}

async function writeLock(packageJson, manifest) {
  await mkdir(dirname(LOCK_FILE), { recursive: true });

  const lock = {
    schemaVersion: 1,
    bundle: packageJson.name,
    version: packageJson.version,
    managedSkills: manifest.skills.map((skill) => skill.name),
  };

  await writeFile(LOCK_FILE, `${JSON.stringify(lock, null, 2)}\n`);
}

async function syncSkill(skill, version, force) {
  const sourcePath = resolve(PACKAGE_ROOT, skill.path);
  const targetPath = join(TARGET_ROOT, skill.name);
  const sourceHash = await hashDirectory(sourcePath);
  const targetExists = await exists(targetPath);

  if (targetExists) {
    const markerPath = join(targetPath, MARKER_FILE);
    const marker = await readJsonIfExists(markerPath);

    if (!marker && !force) {
      throw new Error(
        `${targetPath} 不是由公共包管理的 Skill。` +
        `如需覆盖，请显式使用 --force。`
      );
    }

    if (marker) {
      const currentHash = await hashDirectory(targetPath);

      if (
        currentHash !== marker.contentHash &&
        !force
      ) {
        throw new Error(
          `${targetPath} 存在本地修改，请合并后再同步，` +
          `或使用 --force 覆盖。`
        );
      }

      if (
        marker.version === version &&
        currentHash === sourceHash
      ) {
        console.log(`unchanged ${skill.name}`);
        return;
      }
    }
  }

  await mkdir(TARGET_ROOT, { recursive: true });

  const tempRoot = await mkdtemp(
    join(TARGET_ROOT, `.${skill.name}.tmp-`)
  );

  const stagedPath = join(tempRoot, skill.name);

  try {
    await cp(sourcePath, stagedPath, { recursive: true });

    await writeFile(
      join(stagedPath, MARKER_FILE),
      `${JSON.stringify(
        {
          bundle: '@fa-admin/agent-skills',
          skill: skill.name,
          version,
          contentHash: sourceHash,
        },
        null,
        2
      )}\n`
    );

    if (await exists(targetPath)) {
      await rm(targetPath, { recursive: true, force: true });
    }

    await rename(stagedPath, targetPath);
    console.log(`synced    ${skill.name}`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function sync(force) {
  const { packageJson, manifest } = await loadPackage();

  for (const skill of manifest.skills) {
    await syncSkill(skill, packageJson.version, force);
  }

  await writeLock(packageJson, manifest);
  console.log(`lock      ${packageJson.version}`);
}

async function check() {
  const { packageJson, manifest } = await loadPackage();
  const errors = [];

  const lock = await readJsonIfExists(LOCK_FILE);

  if (!lock) {
    errors.push(`缺少 ${LOCK_FILE}`);
  } else if (lock.version !== packageJson.version) {
    errors.push(
      `锁定版本为 ${lock.version}，当前包版本为 ${packageJson.version}`
    );
  }

  for (const skill of manifest.skills) {
    const sourcePath = resolve(PACKAGE_ROOT, skill.path);
    const targetPath = join(TARGET_ROOT, skill.name);
    const markerPath = join(targetPath, MARKER_FILE);
    const marker = await readJsonIfExists(markerPath);

    if (!(await isDirectory(targetPath))) {
      errors.push(`缺少 Skill：${targetPath}`);
      continue;
    }

    if (!marker) {
      errors.push(`Skill 没有同步标记：${targetPath}`);
      continue;
    }

    if (marker.version !== packageJson.version) {
      errors.push(
        `${skill.name} 版本不匹配：` +
        `${marker.version} !== ${packageJson.version}`
      );
    }

    const sourceHash = await hashDirectory(sourcePath);
    const targetHash = await hashDirectory(targetPath);

    if (sourceHash !== targetHash) {
      errors.push(`Skill 内容不一致：${skill.name}`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR ${error}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log('AI skills are consistent.');
}

async function main() {
  const argument = process.argv[2] || 'sync';
  const force = process.argv.includes('--force');

  if (argument === 'package-check') {
    await loadPackage();
    console.log('Package is valid.');
    return;
  }

  if (argument === 'check' || argument === '--check') {
    await check();
    return;
  }

  if (argument === 'sync') {
    await sync(force);
    return;
  }

  console.error(
    '用法：fa-admin-skills sync [--force] | check | package-check'
  );
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`ERROR ${error.message}`);
  process.exitCode = 1;
});