import { runConnectionAndMerge } from '../../db/meiliSearch/fetchData';
import {} from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function addDocsToMeili(ctx: RequestContext, req: any) {
  try {
    let adding = await runConnectionAndMerge();
    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: adding
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not merge collection from mongoose',
      data: error
    };
  }
}

export default makeController(addDocsToMeili);
