import { MongoError } from 'mongodb';
import makeController from '../../utils/makeController';

export async function getTxn(ctx: RequestContext, req: any) {
  try {
    const { transactionId = '' } = req.query;

    const txn = await ctx.dbs.biz.getOne('transactiondetails', { transactionId });
    ctx.log.info({ txn }, 'get txn db response');
    if (!txn) {
      return {
        message: `Transaction with id - [${transactionId}] not found`,
        statusCode: 404,
        success: false
      };
    }

    return {
      success: true,
      message: `Transaction with id [${transactionId}] retrieved successfully`,
      data: txn
    };
  } catch (error: any) {
    if (error instanceof MongoError) {
      ctx.log.error({ error: error.message }, 'get transaction errored');
      return {
        success: false,
        message: error.message,
        statusCode: 500
      };
    }
    ctx.log.error({ error: error.message }, 'get transaction errored');
    return {
      success: false,
      message: 'Get transaction request errored',
      statusCode: 500
    };
  }
}

export default makeController(getTxn);
