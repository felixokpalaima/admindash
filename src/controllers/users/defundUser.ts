import { bizGateway } from '../../gateways/biz';
import makeController from '../../utils/makeController';
import helpers from '../../utils/helpers';

export async function defundUser(ctx: RequestContext, req: any): Promise<Res<ControllerResponse>> {
  try {
    const { amount, currency, reason, username }: DefundUserRequest = req.body;
    const {
      adminDetails: { token }
    } = req.store;

    const payload = {
      memo: reason,
      currency,
      amount: String(amount),
      receiverUsername: 'payments',
      transferId: helpers.generateId(),
      senderUsername: username
    };

    let defundUserRequest = await bizGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: '/v2/balance/user',
      payload,
      timeout: 10000,
      otherHeaders: { authorization: `Bearer ${token}` }
    });

    const { message, success, data, status } = defundUserRequest.data;

    return {
      statusCode: status,
      message,
      success,
      data
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      statusCode: 500,
      success: false,
      message: 'Unable to defund user'
    };
  }
}

export default makeController(defundUser);
