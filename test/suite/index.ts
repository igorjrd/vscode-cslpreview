import * as path from 'path';
import Mocha from 'mocha';
import glob from 'glob';
import * as vscode from 'vscode';

export async function run(): Promise<void> {
	const extension = vscode.extensions.getExtension('igorjrd.cslpreview');
	if (!extension) {
		throw new Error('Extension not found');
	}
	await extension.activate();

	vscode.commands.executeCommand('workbench.action.closeAllEditors');

	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd'
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}