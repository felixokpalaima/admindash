import { Context, DecoratorBase } from 'elysia';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export default function makeController<R, S>(func: Controller<R, S>) {
  return (ctx: RequestContext) =>
    async ({
      request,
      body,
      query,
      set,
      store
    }:
      | {
          request?: Request;
          body?: unknown;
          query?: R;
          set?: Context['set'];
          store: DecoratorBase['store'];
        }
      | {
          request?: Request;
          body?: R;
          query?: unknown;
          set?: Context['set'];
          store: DecoratorBase['store'];
        }) => {
      // destructure the controller object
      // if get or delete, get query else get body
      const req: any =
        request?.method === 'GET' || request?.method === 'DELETE'
          ? { query, store }
          : { body, store };
      ctx.log = ctx.getLogger('').child({ 'X-App-Request-ID': crypto.randomUUID() });
      // call the controller function
      const response: Res<S> = await func(ctx, req);
      // send the response
      const statusCode = response.statusCode || StatusCodes.OK;
      set ? (set.status = statusCode) : null;
      const message = getReasonPhrase(statusCode);
      const responseBody = {
        message: response.message || message,
        success: response.success,
        data: response.data,
        status: statusCode
      };
      return responseBody;
    };
}
