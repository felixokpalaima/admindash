import { getMerchantBalances } from '../../../db/utils';
import makeController from '../../../utils/makeController';

export async function getBalances(ctx: RequestContext, req: any) {
  try {
    const {
      userDetails: {
        user: { username }
      }
    } = req.store;
    let balances = await getMerchantBalances(username);

    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: balances
    };
  } catch (error: any) {
    let message: string = error.message;

    ctx.getLogger('error').error(message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not get balances'
    };
  }
}

export default makeController(getBalances);
