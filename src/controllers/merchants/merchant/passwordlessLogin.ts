import getConfig from '../../../config';
import { fusionAuthAdminGateway, fusionAuthCoinprofileGateway } from '../../../gateways/fusionAuth';
import makeController from '../../../utils/makeController';

const config = getConfig();

const subAccountLogin = async (email: string) => {
  const adminApplicationId = config.FUSION_AUTH_ADMIN_APPLICATION_ID;
  try {
    return await fusionAuthAdminGateway.makeRequest<FusionAuthLoginResponse>({
      method: 'POST',
      path: `/api/passwordless/start`,
      payload: {
        applicationId: adminApplicationId,
        loginId: email
      }
    });
  } catch (error) {
    return null;
  }
};

const mainAccountLogin = async (email: string) => {
  const applicationId = config.FUSION_AUTH_COINPROFILE_APPLICATION_ID;
  try {
    return await fusionAuthCoinprofileGateway.makeRequest<FusionAuthLoginResponse>({
      method: 'POST',
      path: `/api/passwordless/start`,
      payload: {
        applicationId,
        loginId: email
      }
    });
  } catch (error) {
    return null;
  }
};

export async function passwordlessLogin(ctx: RequestContext, req: any) {
  try {
    const { email } = req.body;

    const attemptSubAccountLogin = await subAccountLogin(email);
    const attemptMainAccountLogin = await mainAccountLogin(email);

    if (!attemptMainAccountLogin && !attemptSubAccountLogin) {
      return {
        success: false,
        statusCode: 404,
        message: `No admin account found for this email`
      };
    }
    if (attemptMainAccountLogin) {
      try {
        await fusionAuthCoinprofileGateway.makeRequest({
          method: 'POST',
          path: `/api/passwordless/send`,
          payload: {
            code: attemptMainAccountLogin?.data.code
          }
        });
      } catch (error) {
        return {
          success: false,
          statusCode: 400,
          message: `Error sending login email to main account`
        };
      }
    } else {
      try {
        await fusionAuthAdminGateway.makeRequest({
          method: 'POST',
          path: `/api/passwordless/send`,
          payload: {
            code: attemptSubAccountLogin?.data.code
          }
        });
      } catch (error) {
        return {
          success: false,
          statusCode: 400,
          message: `Error sending login email to sub account`
        };
      }
    }
    return {
      success: true,
      message: `Login link sent to ${email}`
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      message: 'Invite subaccount request errored',
      statusCode: 500
    };
  }
}

export default makeController(passwordlessLogin);
