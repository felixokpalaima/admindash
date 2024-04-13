import { createToken } from '../../db/meiliSearch/managers';
import makeController from '../../utils/makeController';

export async function generateToken(ctx: RequestContext, req: any) {
  try {
    const { envType, apiKeyDetails } = req.body;

    const createdToken = await createToken(envType, apiKeyDetails);

    return {
      success: true,
      statusCode: 200,
      message: 'successful',
      data: { createdToken }
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    return {
      success: false,
      statusCode: 500,
      message: 'could not create token'
    };
  }
}

export default makeController(generateToken);
