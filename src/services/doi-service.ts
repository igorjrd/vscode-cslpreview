import ajv, { ValidateFunction } from "ajv";
import Citable from "../models/citable";
import CrossRefClient, { CrossRefResponse } from '../client/crossref/crossref-client';

export default class DoiService {
  private static validateItem: ValidateFunction;

  static {
    let ajvInstance = new ajv({ validateSchema: false, allErrors: true, removeAdditional: true });
    this.validateItem = ajvInstance.compile(require('../../resources/csl-schema.json'));
  }

  static async retrieveCitableWithDoi(doi: string): Promise<Citable> {
    let response: CrossRefResponse = await CrossRefClient.requestCrossRef(doi);
    return this.mapCrossRefJson2Citable(response);
  }

  private static mapCrossRefJson2Citable(crossrefJson: CrossRefResponse): Citable {
    let item = crossrefJson.message;
    let out = {} as Citable;
    Object.assign(out, item);

    out.id = item.DOI;
    out.title = item.title[0];
    out['cointainer-title'] = item["container-title"][0];
    out['ISSN'] = item.ISSN[0];
    if (item.type == 'journal-article')
      out.type = 'article-journal';
    delete out['original-title'];

    this.validateItem(out);

    return out;
  }
}
