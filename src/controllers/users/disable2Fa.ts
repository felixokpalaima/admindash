import { bendGateway } from '../../gateways/bend';
import makeController from '../../utils/makeController';

export async function disable2Fa(ctx: RequestContext, req: any): Promise<Res<ControllerResponse>> {
  try {
    const { username } = req.body;

    const {
      adminDetails: { token }
    } = req.store;

    let disable2FaRequest = await bendGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: '/v2/user/admin-disable-two-step-verification',
      timeout: 10000,
      payload: {
        username
      },
      otherHeaders: { authorization: `Bearer ${token}` }
    });
    const { message, success } = disable2FaRequest.data;
    ctx.log.info({ username }, 'disabling 2fa');

    if (success) {
      return {
        statusCode: 200,
        success: success,
        message: message
      };
    } else
      return {
        statusCode: 200,
        success: false,
        message: 'Unable to disable 2FA'
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);

    return {
      statusCode: 500,
      success: false,
      message: 'Unable to disable 2FA'
    };
  }
}

export default makeController(disable2Fa);
