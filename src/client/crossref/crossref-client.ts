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


  static async requestCrossRef(doi: string): Promise<CrossRefResponse> {

    let response = await fetch(
      `${this.CROSS_REF_API_URL}/${doi}`,
      { method: 'GET' }
    );

    if (response.status === 200)
      return await response.json() as CrossRefResponse;
    if (response.status === 404)
      throw new DoiNotFoundError();
  }
}