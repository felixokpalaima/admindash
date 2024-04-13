import { fusionAuthAdminGateway, fusionAuthCoinprofileGateway } from '../../../gateways/fusionAuth';
import makeController from '../../../utils/makeController';

const subAccountLogin = async (code: string) => {
  try {
    return await fusionAuthAdminGateway.makeRequest({
      method: 'POST',
      path: `/api/passwordless/login`,
      payload: { code }
    });
  } catch (error) {
    return null;
  }
};

const mainAccountLogin = async (code: string) => {
  try {
    return await fusionAuthCoinprofileGateway.makeRequest({
      method: 'POST',
      path: `/api/passwordless/login`,
      payload: { code }
    });
  } catch (error) {
    return null;
  }
};

export async function passwordlessLogin(ctx: RequestContext, req: any) {
  try {
    const { code } = req.body;

    const attemptSubAccountLogin = await subAccountLogin(code);
    const attemptMainAccountLogin = await mainAccountLogin(code);

    if (!attemptMainAccountLogin && !attemptSubAccountLogin) {
      return {
        success: false,
        statusCode: 404,
        message: `Invalid code`
      };
    }
    return {
      success: false,
      data: attemptSubAccountLogin?.data ?? attemptMainAccountLogin?.data,
      statusCode: 200,
      message: `Successfully logged in`
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      message: 'Login subaccount request errored',
      statusCode: 500
    };
  }
}

export default makeController(passwordlessLogin);
