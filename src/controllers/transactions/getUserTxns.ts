import { MongoError } from 'mongodb';
import makeController from '../../utils/makeController';

export async function getUserTxns(ctx: RequestContext, req: any) {
  try {
    const { email, username, perPage = 20, page = 1 }: GetTransactionRequest = req.query;

    if (!email && !username) {
      return {
        message: `Provide email or username to fetch user transactions`,
        statusCode: 400,
        success: false
      };
    }
    let user;
    if (email) {
      user = await ctx.dbs.biz.getOne('usersV2', { email });
      ctx.log.info({ user }, 'get user db response');

      if (!user) {
        return {
          message: `User with email - [${email}] not found`,
          statusCode: 404,
          success: false
        };
      }
    }
    if (email && username && user?.username !== username) {
      return {
        message: `Username and email do not match`,
        statusCode: 400,
        success: false
      };
    }

    const userName = username || user?.username;

    const offset = Number(perPage) * (Number(page) - 1);
    const userTxns = await ctx.dbs.biz.paginatedGet(
      'transactiondetails',
      { $or: [{ username: userName }, { sender: userName }] },
      perPage,
      offset
    );

    const transactions = userTxns.data;

    const total = userTxns.total;
    const pages = Math.ceil(total / perPage);

    return {
      success: true,
      message: `User [${userName}] transactions received successfully`,
      data: { transactions, pages: { total, perPage, pages } }
    };
  } catch (error: any) {
    if (error instanceof MongoError) {
      ctx.getLogger('error').error(error.message);
      return {
        success: false,
        message: error.message,
        statusCode: 500
      };
    }
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      message: 'Get user transaction request errored',
      statusCode: 500
    };
  }
}

export default makeController(getUserTxns);
