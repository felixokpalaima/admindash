import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';

export async function getSupportedCurrencies(ctx: RequestContext, req: any) {
  try {
    const currencies = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'GET',
      path: `/v2/currency/supported`,
      timeout: 10000
    });

    if (!currencies.data.data) {
      return {
        success: false,
        statusCode: 400,
        message: 'Could not get supported currencies'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Get supported currencies successful',
      data: currencies.data.data
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'Get supported currencies request errored'
    };
  }
}

export default makeController(getSupportedCurrencies);
