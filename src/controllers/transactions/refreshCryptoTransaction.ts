import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';

export async function refreshCryptoTransaction(
  ctx: RequestContext,
  req: any
): Promise<Res<ControllerResponse>> {
  try {
    const { transactionId, businessId }: RefreshTransactionRequest = req.body;

    let refreshCryptoTransaction = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'get',
      path: `/v2/payment/refresh/${transactionId}?businessId=${businessId}`, //this is calling refreshing from log in biz, no need to authorize until further notice
      timeout: 10000
    });
    const { message, success, data, status } = refreshCryptoTransaction.data;
    ctx.log.info({ transactionId }, `refreshing::: message:${message}, success:${success}`);
    if (success) {
      return {
        statusCode: 200,
        message,
        success,
        data
      };
    } else
      return {
        statusCode: status,
        success: false,
        message: 'refresh crypto transaction failed',
        data
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);
    return {
      statusCode: 500,
      success: false,
      message: 'refresh crypto transaction failed'
    };
  }
}

export default makeController(refreshCryptoTransaction);
