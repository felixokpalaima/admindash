import axios from 'axios';

export default class Basegateway {
  constructor(private details: GatewayDetails) {}
  async makeRequest<T>(requestData: RequestData) {
    const { method, path, payload, timeout } = requestData;
    const headers = { ...this.details.headers, ...requestData.otherHeaders };
    const requestConfig = {
      headers: {
        ...headers
      },
      method,
      data: payload,
      url: `${this.details.baseUrl}${path}`,
      timeout
    };
    let requesting = await axios<T>(requestConfig);
    return requesting;
  }
}
