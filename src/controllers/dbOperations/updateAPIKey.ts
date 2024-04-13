import { updateAPIKey } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function updateKey(ctx: RequestContext, req: any) {
  try {
    const { uid } = req.body;

    const update: Record<string, any> = {};

    for (const field of ['name', 'description', 'actions', 'indexes', 'expiresAt']) {
      if (req.body[field] !== undefined) {
        if (req.body[field] === 'actions' || req.body[field] === 'indexes') {
          update[field] = req.body[field].split(',').map((i: string) => i.trim());
        } else if (req.body[field] === 'expiresAt') {
          update[field] = new Date(req.body[field]);
        } else {
          update[field] = req.body[field];
        }
      }
    }

    const createdKey = await updateAPIKey(update, uid);

    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: createdKey
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not update key'
    };
  }
}

export default makeController(updateKey);
