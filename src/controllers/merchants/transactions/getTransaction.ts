import { getDocById } from '../../../db/meiliSearch/managers';
import makeController from '../../../utils/makeController';
import { MeiliSearchApiError, MeiliSearchError } from 'meilisearch';
import helpers, { getterMap } from '../../../utils/helpers';
import { detailsMap } from '../../../db/utils';

export async function getOne(ctx: RequestContext, req: any) {
  try {
    const { id } = req.query;
    const {
      userDetails: {
        user: { username }
      }
    } = req.store;
    let data = await getDocById('Transactions', id); //sort by created At {sort: ['createdAt:desc']} and filter with merchant username
    const { fromAccount, toAccount, transactionType } = data;

    let otherDetails = await detailsMap[transactionType as keyof typeof detailsMap](
      data[getterMap[transactionType as keyof typeof getterMap]]
    );

    if (username === fromAccount || username === toAccount)
      return {
        success: true,
        statusCode: 200,
        message: 'successful',
        data: { ...helpers.renameTransactionFields(data, username), ...otherDetails }
      };
    else
      return {
        success: false,
        statusCode: 500,
        message: 'could not get document'
      };
  } catch (error: any) {
    let message: string = error.message;
    if (error instanceof MeiliSearchApiError || error instanceof MeiliSearchError) {
      message = error.message;
    }

    ctx.getLogger('error').error(message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not get document'
    };
  }
}

export default makeController(getOne);
