import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';

export async function getRate(ctx: RequestContext, req: any) {
  try {
    const rates = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'GET',
      path: `/v2/currency/admin-rate`,
      timeout: 10000
    });

    if (!rates.data.data) {
      return {
        success: false,
        statusCode: 400,
        message: 'Could not get rate'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Get rates successful',
      data: rates.data.data
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'Get rate request errored'
    };
  }
}

export default makeController(getRate);
