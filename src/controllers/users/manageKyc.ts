import { bendGateway } from '../../gateways/bend';
import makeController from '../../utils/makeController';

export async function manageKyc(ctx: RequestContext, req: any): Promise<Res<ControllerResponse>> {
  try {
    const { username, kycLevel }: ManageKycRequest = req.body;

    const {
      adminDetails: { token }
    } = req.store;

    let updateKycRequest = await bendGateway.makeRequest<GatewayBaseResponse>({
      method: 'post',
      path: '/v2/kyc/updatekyclevel',
      timeout: 10000,
      payload: {
        username,
        level: kycLevel
      },
      otherHeaders: { authorization: `Bearer ${token}` }
    });
    const { message, success } = updateKycRequest.data;
    if (success) {
      return {
        statusCode: 200,
        success: true,
        message
      };
    } else
      return {
        statusCode: 200,
        success: false,
        message: 'Unable to downgrade user'
      };
  } catch (error: any) {
    ctx.getLogger('error').error(error);
    return {
      statusCode: 500,
      success: false,
      message: 'Unable to downgrade user'
    };
  }
}

export default makeController(manageKyc);
