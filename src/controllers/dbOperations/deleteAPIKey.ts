import { deleteAPIKey } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function deleteKey(ctx: RequestContext, req: any) {
  try {
    const { uid } = req.body;

    await deleteAPIKey(uid);

    return {
      success: true,
      statusCode: 200,
      message: 'successful'
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not delete key'
    };
  }
}

export default makeController(deleteKey);
