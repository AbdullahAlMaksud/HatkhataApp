const { existsSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const shortKeyboardControllerRoots = [
  path.resolve('C:/k'),
  path.join(os.homedir(), 'kbc'),
];
const keyboardControllerRoot = path.resolve(
  __dirname,
  'node_modules',
  'react-native-keyboard-controller',
);

const resolvedKeyboardControllerRoot =
  shortKeyboardControllerRoots.find(root => existsSync(root)) ??
  keyboardControllerRoot;

module.exports = {
  dependencies: {
    'react-native-keyboard-controller': {
      root: resolvedKeyboardControllerRoot,
    },
  },
};
