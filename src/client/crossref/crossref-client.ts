import request from "sync-request";
import DoiNotFoundError from '../../error/doi-not-found-error';

export interface CrossRefResponse {
  message: CrossRefCitable;
}

export interface CrossRefCitable {
  DOI: string;
  type: string;
  title: [string];
  'container-title': [string];
  ISSN: [string];
}

export default class CrossRefClient {
  private static CROSS_REF_API_URL = "http://api.crossref.org/works";


  static requestCrossRef(doi: string): CrossRefResponse {
    let response = request("GET", `${this.CROSS_REF_API_URL}/${doi}`);

    if (response.statusCode == 200)
      return JSON.parse(response.body.toString()) as CrossRefResponse;
    if (response.statusCode == 404)
      throw new DoiNotFoundError();
  }
}