import * as assert from 'assert';
import CrossRefClient from '../../src/client/crossref/crossref-client';

suite('CrossRef Client Test Suite', () => {
  test('Check DOI request works test', () => {
    let response = CrossRefClient.requestCrossRef('10.1016/j.jallcom.2019.153170');
      assert.ok(response != undefined);
      assert.strictEqual(response.message.DOI, '10.1016/j.jallcom.2019.153170');
  });

  test('Check DOI not found test', () => {
    assert.throws(
      () => CrossRefClient.requestCrossRef('INVALID DOI'),
      'Expected DoiNotFoundError to be thrown'
    );
  });
});
