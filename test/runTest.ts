import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js');

    // Pin VS Code so the test host doesn't follow the latest stable release,
    // whose macOS app layout @vscode/test-electron 2.4.1 cannot launch (CI ENOENT).
    await runTests({ version: '1.96.4', extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error(err);
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
