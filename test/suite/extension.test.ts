import * as assert from 'assert';
import { MLA } from './fixtures';
import vscode, { l10n } from 'vscode';
import Messages from '../../src/constants/messages';
import CommandKeys from '../../src/constants/command-keys';
import Preview from '../../src/models/preview';
import Optional from '../../src/models/optional';
import * as sinon from 'sinon';

const cslStyle = MLA;

suite('CSL Preview tests', () => {
	test('Default documents preview Test', async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');

		const originalQuickPick = vscode.window.showQuickPick;
		(vscode.window as any).showQuickPick = async () => {
			return l10n.t(Messages.DEFAULT_DOCUMENTS_CITABLES_SRC);
		};

		await vscode.workspace.openTextDocument({ content: cslStyle, language: 'xml' })
			.then(doc => {
				return vscode.window.showTextDocument(doc);
			}).then(async () => {
				await vscode.commands.executeCommand<Optional<Preview>>(CommandKeys.SHOW_PREVIEW)
					.then(previewPromise => {
						assert.ok(previewPromise.isPresent());
						let preview = previewPromise.get();
						let previewContent = preview.getWebView().html;
						assert.ok(previewContent.includes(`${l10n.t('Individual citations')}`));
						assert.ok(previewContent.includes('(Hisakata, Nishida, and Johnston)'));
						assert.ok(previewContent.includes(`${l10n.t('Unique citation')}`));
						assert.ok(previewContent.includes('(Hisakata, Nishida, and Johnston; Musk; Hogue; Sambrook and Russell)'));
						assert.ok(previewContent.includes(`${l10n.t('Bibliography')}`));
						assert.ok(previewContent.includes(`An Adaptable Metric Shapes Perceptual Space.`));
					});
			});
		
		vscode.window.showQuickPick = originalQuickPick;
	});

	test('DOI documents preview Test', async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');

		const originalQuickPick = vscode.window.showQuickPick;
		(vscode.window as any).showQuickPick = async () => {
			return l10n.t(Messages.DOI_CITABLES_SRC);
		};

		const originalInputBox = vscode.window.showInputBox;
		vscode.window.showInputBox = async () => {
			return '10.1016/j.jallcom.2019.153170';
		};

		await vscode.workspace.openTextDocument({ content: cslStyle, language: 'xml' })
			.then(doc => {
				return vscode.window.showTextDocument(doc);
			}).then(async () => {
				await vscode.commands.executeCommand<Optional<Preview>>(CommandKeys.SHOW_PREVIEW)
					.then(previewPromise => {
						assert.ok(previewPromise.isPresent());
						let preview = previewPromise.get();
						let previewContent = preview.getWebView().html;
						assert.ok(previewContent.includes(`${l10n.t('Individual citations')}`));
						assert.ok(previewContent.includes('(Marques, Silva, and Santos)'));
						assert.ok(previewContent.includes(`${l10n.t('Unique citation')}`));
						assert.ok(previewContent.includes(`${l10n.t('Bibliography')}`));
						assert.ok(previewContent.includes(`Rapid Precipitation of Intermetallic Phases during Isothermal Treatment of Duplex Stainless Steel Joints Produced by Friction Stir Welding.`));
					});
			});
		
		vscode.window.showQuickPick = originalQuickPick;
		vscode.window.showInputBox = originalInputBox;
	});

	test('Invalid DOI Test', async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');

		const originalQuickPick = vscode.window.showQuickPick;
		(vscode.window as any).showQuickPick = async () => {
			return l10n.t(Messages.DOI_CITABLES_SRC);
		};

		const originalInputBox = vscode.window.showInputBox;
		vscode.window.showInputBox = async () => {
			return 'invalid-doi';
		};

		const originalShowErrorMessage = vscode.window.showErrorMessage;
		vscode.window.showErrorMessage = async (message: string) => {
			return undefined;
		}

		const spy = sinon.spy(vscode.window, 'showErrorMessage');

		await vscode.workspace.openTextDocument({ content: cslStyle, language: 'xml' })
			.then(doc => {
				return vscode.window.showTextDocument(doc);
			}).then(async () => {
				await vscode.commands.executeCommand<Optional<Preview>>(CommandKeys.SHOW_PREVIEW)
					.then(previewPromise => {
						assert.ok(previewPromise.isEmpty());
						assert.ok(spy.called);
						assert.ok(spy.calledWith(l10n.t(Messages.DOI_NOT_FOUND)));
					});
			});
		
		vscode.window.showQuickPick = originalQuickPick;
		vscode.window.showInputBox = originalInputBox;
		spy.restore();
		vscode.window.showErrorMessage = originalShowErrorMessage;
	});

	test('Show source Test', async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');

		const originalQuickPick = vscode.window.showQuickPick;
		(vscode.window as any).showQuickPick = async () => {
			return l10n.t(Messages.DEFAULT_DOCUMENTS_CITABLES_SRC);
		};

		await vscode.workspace.openTextDocument({ content: cslStyle, language: 'xml' })
			.then(doc => {
				return vscode.window.showTextDocument(doc);
			}).then(async () => {
				await vscode.commands.executeCommand<Optional<Preview>>(CommandKeys.SHOW_PREVIEW)
					.then(async previewPromise => {
						assert.ok(previewPromise.isPresent());
						let preview = previewPromise.get();
						const editor = preview.getTextEditor();

						await vscode.commands.executeCommand<vscode.TextDocument>(CommandKeys.SHOW_SOURCE)
							.then(textDocument => {
								assert.ok(textDocument);
								assert.strictEqual(textDocument, editor.document);
							});
					});
			});
		
		vscode.window.showQuickPick = originalQuickPick;
	});
});
