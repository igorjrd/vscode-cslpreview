import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import vscode, { l10n, Uri } from 'vscode';
import * as sinon from 'sinon';
import SupplyDefaultDocumentsStrategy from '../../src/commands/preview_citables_supplier/supply-default-documents-strategy';
import ConfigurationService from '../../src/services/configuration-service';
import ContextService from '../../src/services/context-service';
import Messages from '../../src/constants/messages';
import Citable from '../../src/models/citable';

const CITABLES: Array<Citable> = [
  { id: 'item-1', type: 'book', title: 'Default Citable One' },
  { id: 'item-2', type: 'article-journal', title: 'Default Citable Two' },
];

suite('SupplyDefaultDocumentsStrategy tests', () => {
  let tempDir: string;
  let citablesFile: string;
  let configStub: sinon.SinonStub;

  setup(() => {
    // Use a real temp directory so the path is absolute on the current platform
    // (e.g. "/tmp/..." on Linux/macOS, "C:\..." on Windows).
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cslpreview-test-'));
    citablesFile = path.join(tempDir, 'citables.json');
    fs.writeFileSync(citablesFile, JSON.stringify(CITABLES), 'utf-8');
    configStub = sinon.stub(ConfigurationService, 'getCitablesJsonFilePath');
    // ContextService is only initialized when the extension activates, so point it
    // at the real extension folder to let the example-citables fallback resolve.
    const extensionPath = vscode.extensions.getExtension('igorjrd.cslpreview')!.extensionPath;
    sinon.stub(ContextService, 'getExtensionPath').returns(extensionPath);
  });

  teardown(() => {
    sinon.restore();
    fs.rmdirSync(tempDir, { recursive: true });
  });

  test('provideCitables loads citables from the absolute path set in configuration', async () => {
    configStub.returns(citablesFile);

    const citables = await new SupplyDefaultDocumentsStrategy().provideCitables();

    assert.deepStrictEqual(citables, CITABLES);
  });

  test('readCitablesFromJson loads citables from a Uri created from a file path', () => {
    const citables = new SupplyDefaultDocumentsStrategy().readCitablesFromJson(Uri.file(citablesFile));

    assert.deepStrictEqual(citables, CITABLES);
  });

  test('readCitablesFromJson uses the platform file path, not the raw Uri path', () => {
    // Regression test for issue #27: stripping the first character of Uri.path
    // broke absolute paths on Linux (e.g. "/tmp/x.json" became "tmp/x.json").
    const uri = Uri.file(citablesFile);

    const citables = new SupplyDefaultDocumentsStrategy().readCitablesFromJson(uri);

    assert.deepStrictEqual(citables, CITABLES);
  });

  test('provideCitables falls back to example citables and warns when the configured file does not exist', async () => {
    configStub.returns(path.join(tempDir, 'does-not-exist.json'));
    const infoStub = sinon.stub(vscode.window, 'showInformationMessage');

    const citables = await new SupplyDefaultDocumentsStrategy().provideCitables();

    assert.ok(Array.isArray(citables));
    assert.notDeepStrictEqual(citables, CITABLES);
    assert.strictEqual(infoStub.callCount, 1);
    assert.deepStrictEqual(infoStub.firstCall.args, [l10n.t(Messages.INVALID_CITABLES_SRC_FILE_MESSAGE)]);
  });

  test('provideCitables falls back to example citables when no path is configured', async () => {
    configStub.returns('');
    const infoStub = sinon.stub(vscode.window, 'showInformationMessage');

    const citables = await new SupplyDefaultDocumentsStrategy().provideCitables();

    assert.ok(Array.isArray(citables));
    assert.notDeepStrictEqual(citables, CITABLES);
    sinon.assert.notCalled(infoStub);
  });
});
