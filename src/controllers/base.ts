import makeController from '../utils/makeController';

export async function base(ctx: RequestContext, request: any) {
  return { message: 'Admin dashboard api' };
}

export default makeController(base);
