import { remitGateway } from '../../gateways/remit';
import makeController from '../../utils/makeController';

export async function retryTransaction(
  ctx: RequestContext,
  req: any
): Promise<Res<ControllerResponse>> {
  try {
    const { id, service, accountNumber, account, bankCode, bankName }: RetryTransactionRequest =
      req.body;

    let retryTransaction = await remitGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: `/api/v1/payout/manual-retry`,
      timeout: 10000,
      payload: {
        id,
        service,
        accountNumber,
        account,
        bankCode,
        bankName
      }
    });
    const { message, success, data, status } = retryTransaction.data;
    ctx.log.info({ id }, `retried payout, success: ${success} message:${message}`);

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
        message: 'retry transaction failed',
        data
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);
    return {
      statusCode: 500,
      success: false,
      message: 'retry transaction failed'
    };
  }
}

export default makeController(retryTransaction);
