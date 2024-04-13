import { fusionAuthAdminGateway } from '../../../gateways/fusionAuth';
import makeController from '../../../utils/makeController';

export async function getAccountEmails(ctx: RequestContext, req: any) {
  try {
    const {
      userDetails: { user }
    } = req.store;

    const subs = [];

    const subAccounts = await fusionAuthAdminGateway.makeRequest<FusionAuthSearchUsersResponse>({
      method: 'GET',
      path: `/api/user/search?queryString=${encodeURI(`fullName:${user.username}SubAccount`)}`
    });

    if (subAccounts.data.users) {
      for (const subAccount of subAccounts.data.users) {
        subs.push({ email: subAccount.email, roles: subAccount.registrations[0].roles });
      }
    }
    return {
      success: true,
      message: `Successfully retrieved associated emails`,
      data: {
        mainAccount: user.email,
        subAccounts: subs
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Could not get account emails',
      statusCode: 500
    };
  }
}

export default makeController(getAccountEmails);
