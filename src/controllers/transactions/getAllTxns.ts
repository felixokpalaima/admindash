import makeController from '../../utils/makeController';
import { MongoError } from 'mongodb';

export async function getAllTxns(ctx: RequestContext, req: any) {
  try {
    const {
      perPage = 20,
      page = 1,
      currency,
      type,
      status,
      username,
      transactionId,
      query = ''
    }: GetTransactionsRequest = req.query;

    const filterParam: any = {
      currency,
      type,
      status,
      username,
      transactionId,
      query
    };

    for (const filter in filterParam) {
      if (filterParam[filter] === '' || !filterParam[filter]) {
        delete filterParam[filter];
      }
    }

    if (filterParam.username) {
      let addingSenderfield = [{ sender: username }, { username }];
      filterParam['$or'] = addingSenderfield;
      delete filterParam['username'];
    }
    let search = false;
    let searchFields: Array<string> = [];
    if (query && query.length > 0) {
      delete filterParam['query'];
      search = true;
      searchFields = ['transactionId', 'sender', 'username', 'transferId'];
    }

    const offset = Number(perPage) * (Number(page) - 1);
    const data = await ctx.dbs.biz.paginatedGet(
      'transactiondetails',
      { ...filterParam },
      Number(perPage),
      offset,
      search,
      searchFields,
      { query }
    );
    const transactions = data.data;

    const total = data.total;
    const pages = Math.ceil(total / perPage);

    return {
      message: 'Get transactions success',
      data: { transactions, pages: { total, perPage, pages } },
      success: true
    };
  } catch (error: any) {
    if (error instanceof MongoError) {
      ctx.getLogger('error').error(error.message);
      return {
        message: error.message,
        statusCode: 500,
        success: false
      };
    }

    ctx.getLogger('error').error(error.message);
    return {
      message: 'Get all transactions request errored',
      statusCode: 500,
      success: false
    };
  }
}

export default makeController(getAllTxns);
