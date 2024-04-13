import getConfig from '../../../config';
import { fusionAuthAdminGateway, fusionAuthCoinprofileGateway } from '../../../gateways/fusionAuth';
import makeController from '../../../utils/makeController';
import { Roles } from '../../../types/enums';

const config = getConfig();

const mainAccountExists = async (email: string) => {
  try {
    return await fusionAuthCoinprofileGateway.makeRequest<FusionAuthGetUserResponse>({
      method: 'GET',
      path: `/api/user?email=${email}`
    });
  } catch (error) {
    return null;
  }
};

export async function inviteSubAccount(ctx: RequestContext, req: any) {
  try {
    const {
      userDetails: { user, sub }
    } = req.store;
    const { email, roles } = req.body;

    if (email === user.email) {
      return {
        success: false,
        statusCode: 400,
        message: 'Cannot invite main account email as sub account'
      };
    }

    const isAMainAccount = await mainAccountExists(email);

    if (isAMainAccount) {
      return {
        success: false,
        statusCode: 400,
        message: 'Email exists as main account'
      };
    }

    const payload = {
      registration: {
        applicationId: config.FUSION_AUTH_ADMIN_APPLICATION_ID,
        roles: roles ? [roles] : [Roles.customerSuccess],
        data: {
          mainAccountUsername: user.username,
          mainAccountSub: sub
        }
      },
      user: { email, fullName: `${user.username}SubAccount` },
      sendSetPasswordEmail: true
    };

    const registeredUser = await fusionAuthAdminGateway.makeRequest<FusionAuthInviteResponse>({
      method: 'POST',
      path: `/api/user/registration`,
      payload
    });

    return {
      success: true,
      message: `[${email}] invited successfully`,
      data: registeredUser?.data?.user
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    if (error.response.data.fieldErrors['user.email'][0].message) {
      return {
        success: false,
        statusCode: 400,
        message: error.response.data.fieldErrors['user.email'][0].message
      };
    }
    return {
      success: false,
      message: 'Invite subaccount request errored',
      statusCode: 500
    };
  }
}

export default makeController(inviteSubAccount);
