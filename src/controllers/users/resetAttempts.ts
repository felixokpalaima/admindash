import makeController from '../../utils/makeController';
import { bendGateway } from '../../gateways/bend';

export async function resetUserAttempts(
  ctx: RequestContext,
  req: any
): Promise<Res<ControllerResponse>> {
  try {
    const { email }: ResetAttemptsReq = req.body;

    const payload = {
      email
    };

    let resetUserAttempts = await bendGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: '/v2/kyc/resetAttempts',
      payload,
      timeout: 10000
    });

    const { message, success } = resetUserAttempts.data;

    return {
      statusCode: 200,
      success,
      message
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      statusCode: 500,
      success: false,
      message: 'Unable to reset user attempts'
    };
  }
}

export default makeController(resetUserAttempts);
