import makeController from '../../../utils/makeController';

export async function getMerchant(ctx: RequestContext, req: any) {
  try {
    const {
      userDetails: { user, subaccount }
    } = req.store;
    return {
      success: true,
      message: `Merchant [${user.username}] retrieved successfully`,
      data: { ...user, subaccount }
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      message: 'Get merchant request errored',
      statusCode: 500
    };
  }
}

export default makeController(getMerchant);
