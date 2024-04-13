import { MongoError } from 'mongodb';
import makeController from '../../utils/makeController';

type FilterFields = {
  username?: string;
  currency?: string;
  status?: string;
  type?: string;
};

export async function filterTxns(ctx: RequestContext, req: any) {
  try {
    const {
      username,
      currency,
      status,
      type,
      perPage = 20,
      page = 1
    }: GetTransactionsRequest = req.query;

    if (!username && !currency && !status && !type) {
      return {
        message: `Provide fields to filter transactions by`,
        statusCode: 400,
        success: false
      };
    }

    if (username) {
      const user = await ctx.dbs.biz.getOne('usersV2', { username });
      if (!user) {
        return {
          message: `User [${username}] not found`,
          statusCode: 404,
          success: false
        };
      }
    }

    const query: FilterFields = {};
    if (username) query['username'] = username;
    if (currency) query['currency'] = currency;
    if (status) query['status'] = status;
    if (type) query['type'] = type;

    const offset = Number(perPage) * (Number(page) - 1);

    const data = await ctx.dbs.biz.paginatedGet('transactiondetails', query, perPage, offset);

    const transactions = data.data;

    const total = data.total;
    const pages = Math.ceil(total / perPage);

    return {
      success: true,
      message: `Transactions received successfully`,
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
      message: 'Filter transactions request errored',
      statusCode: 500
    };
  }
}

export default makeController(filterTxns);
