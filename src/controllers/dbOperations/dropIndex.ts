import { indexDropper } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function dropIndex(ctx: RequestContext, req: any) {
  try {
    const { index } = req.query;

    let dropping = await indexDropper(index);
    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: dropping
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not drop index'
    };
  }
}

export default makeController(dropIndex);
