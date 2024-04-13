import { getAPIKeys } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function getKeys(ctx: RequestContext, req: any) {
  try {
    const { limit } = req.query;

    const keys = await getAPIKeys(limit);

    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: keys
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not get keys'
    };
  }
}

export default makeController(getKeys);
