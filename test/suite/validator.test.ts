import * as assert from 'assert';
import validate from '../../libs/csl-validator';
import { MLA } from './fixtures';


suite('csl-validator.js integration tests', () => {
  test('Valid test', () => {
    assert.strictEqual(validate(MLA), '');
  });

  test('Invalid test', () => {
    assert.notStrictEqual(validate(MLA.replace('<style', '<styl')), '');
  });
});
