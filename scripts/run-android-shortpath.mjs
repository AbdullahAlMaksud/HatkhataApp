import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptFilePath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptFilePath), '..');
const cliArgs = process.argv.slice(2);

const repoCandidates =
  process.platform === 'win32'
    ? ['C:/h', path.join(os.homedir(), 'hhapp')]
    : [path.join(os.homedir(), 'hhapp')];

const keyboardControllerCandidates =
  process.platform === 'win32'
    ? ['C:/k', path.join(os.homedir(), 'kbc')]
    : [path.join(os.homedir(), 'kbc')];

const keyboardControllerTarget = path.join(
  projectRoot,
  'node_modules',
  'react-native-keyboard-controller',
);

function toFsPath(value) {
  if (process.platform !== 'win32') return value;
  return value.replace(/^\/+([A-Za-z]:)/, '$1');
}

function ensureJunction(target, actual) {
  const safeTarget = toFsPath(path.resolve(target));
  const safeActual = toFsPath(path.resolve(actual));

  try {
    if (!existsSync(safeActual)) {
      return null;
    }

    if (existsSync(safeTarget)) {
      try {
        const targetReal = realpathSync(safeTarget);
        const actualReal = realpathSync(safeActual);
        if (targetReal.toLowerCase() === actualReal.toLowerCase()) {
          return safeTarget;
        }
      } catch {
        // ignore and replace target below
      }

      rmSync(safeTarget, { recursive: true, force: true });
    }

    mkdirSync(path.dirname(safeTarget), { recursive: true });
    symlinkSync(safeActual, safeTarget, 'junction');
    return safeTarget;
  } catch {
    return null;
  }
}

function firstExisting(paths) {
  for (const item of paths) {
    if (existsSync(item)) {
      return item;
    }
  }
  return null;
}

const shortRepoPath =
  repoCandidates
    .map(candidate => ensureJunction(candidate, projectRoot))
    .find(Boolean) || projectRoot;

const shortKeyboardPath =
  keyboardControllerCandidates
    .map(candidate => ensureJunction(candidate, keyboardControllerTarget))
    .find(Boolean) || firstExisting(keyboardControllerCandidates);

if (shortKeyboardPath) {
  console.log(`[shortpath] keyboard-controller => ${shortKeyboardPath}`);
}
console.log(`[shortpath] project root => ${shortRepoPath}`);

const expoCliPath = path.join(
  projectRoot,
  'node_modules',
  'expo',
  'bin',
  'cli',
);

const command = existsSync(expoCliPath)
  ? process.execPath
  : process.platform === 'win32'
    ? 'npx.cmd'
    : 'npx';
const args = existsSync(expoCliPath)
  ? [expoCliPath, 'run:android', ...cliArgs]
  : ['expo', 'run:android', ...cliArgs];

const result = spawnSync(command, args, {
  cwd: shortRepoPath,
  stdio: 'inherit',
  env: {
    ...process.env,
    EXPO_USE_LOCAL_CLI: '1',
  },
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
