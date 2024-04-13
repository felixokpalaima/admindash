import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';

export async function setRate(ctx: RequestContext, req: any) {
  try {
    const { margin, type }: SetRateRequest = req.body;

    const mapType = {
      sell: 'externalRateAdd', // selling to users
      buy: 'externalRateSub' // buying from users
    };

    const requestToSetRate = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'PUT',
      path: `/v2/fees/sa16AST2UPHvtu8WoCN`,
      payload: {
        [mapType[type]]: margin
      },
      timeout: 10000
    });

    if (!requestToSetRate.data.data) {
      return {
        success: false,
        statusCode: 400,
        message: 'Could not set rate'
      };
    }

    const requestToLoadRate = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'GET',
      path: `/v2/fees/load/XODArqmpFEtXgXlbZYZhJ7DCCmN?id=${requestToSetRate.data.data}`,
      timeout: 10000
    });

    if (!requestToLoadRate.data.success) {
      return {
        success: false,
        statusCode: 400,
        message: 'Could not load rate'
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Successfully set rates'
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'Set rate request errored'
    };
  }
}

export default makeController(setRate);
