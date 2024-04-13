import makeController from '../utils/makeController';

export async function echo(ctx: RequestContext, { message = 0 }) {
  ctx.log.info('v1 echo request');
  ctx.log.debug('v1 echo request debug');
  return { message: 'v1 echo response', data: Number(message) };
}

export default makeController(echo);
