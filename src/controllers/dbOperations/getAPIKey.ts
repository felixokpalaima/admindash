import { getAPIKey } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function getKey(ctx: RequestContext, req: any) {
  try {
    const { uid } = req.query;

    const key = await getAPIKey(uid);

    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: key
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not get key'
    };
  }
}

export default makeController(getKey);
