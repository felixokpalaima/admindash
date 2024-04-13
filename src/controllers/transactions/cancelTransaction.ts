import { remitGateway } from '../../gateways/remit';
import makeController from '../../utils/makeController';

export async function cancelTransaction(
  ctx: RequestContext,
  req: any
): Promise<Res<ControllerResponse>> {
  try {
    const { transactionId } = req.body;

    let cancelTransaction = await remitGateway.makeRequest<GatewayBaseResponse>({
      method: 'get',
      path: `/api/v1/payout/cancel?id=${transactionId}`, //to be determined
      timeout: 10000
    });
    const { message, success, data, status } = cancelTransaction.data;
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
        message: 'cancel transaction failed',
        data
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);
    return {
      statusCode: 500,
      success: false,
      message: 'cancel transaction failed'
    };
  }
}

export default makeController(cancelTransaction);
