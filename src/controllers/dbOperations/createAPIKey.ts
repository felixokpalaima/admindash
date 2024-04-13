import { createAPIKey } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function createKey(ctx: RequestContext, req: any) {
  try {
    const { name, description, actions, indexes, expiresAt } = req.body;

    const createKey = {
      name,
      description,
      expiresAt: new Date(expiresAt),
      actions: actions.split(',').map((i: string) => i.trim()),
      indexes: indexes.split(',').map((i: string) => i.trim())
    };

    const createdKey = await createAPIKey(createKey);

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
      message: 'could not create key'
    };
  }
}

export default makeController(createKey);
