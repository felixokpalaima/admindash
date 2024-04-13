import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';
import speak from 'speakeasy';
import getConfig from '../../config';

export async function enableAndDisableWithdrawals(
  ctx: RequestContext,
  req: any
): Promise<Res<ControllerResponse>> {
  try {
    const { canWithdraw, username, totp }: ManageWithdrawalRequest = req.body;
    let verifiedTotp = speak.totp.verify({
      secret: getConfig().TOTP_SECRET,
      encoding: 'base32',
      token: totp,
      window: 1
    });

    if (!totp || !verifiedTotp) {
      return {
        statusCode: 400,
        message: 'kindly supply supply a valid totp with this request',
        success: false
      };
    }

    const {
      adminDetails: { token }
    } = req.store;
    let enableAndDisableWithdrawalRequest = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: '/v2/balance/canwithdraw',
      payload: {
        canWithdraw,
        username
      },
      timeout: 10000,
      otherHeaders: { authorization: `Bearer ${token}` }
    });
    const { message, success, data, status } = enableAndDisableWithdrawalRequest.data;
    if (success) {
      return {
        statusCode: status,
        message,
        success,
        data
      };
    } else
      return {
        statusCode: status,
        success: false,
        message: 'Unable to change withdrawal status',
        data
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);
    return {
      statusCode: 500,
      success: false,
      message: 'Unable to change withdrawal status'
    };
  }
}

export default makeController(enableAndDisableWithdrawals);
