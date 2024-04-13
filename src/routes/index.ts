import { Elysia } from 'elysia';
import getv1Routes from './v1';
import ping from '../controllers/ping';
import base from '../controllers/base';
import notfound from '../controllers/notfound';
import { authorize } from '../hooks/authentication';

export default function getRoutes(ctx: RequestContext) {
  return (router: Elysia) => {
    const routes = router;
    routes.onError(({ code, error, set: _set }) => {
      if (code === 'VALIDATION') {
        return {
          message: 'Validation Error',
          data: error.all.map((e) => ({
            value: e.value,
            message: `Invalid [${e.path.replace(/^\//, '')}] value`
          }))
        };
      }
    });

    routes.get('/', base(ctx));
    routes.get('/ping', ping(ctx));
    const routesWithV1 = getv1Routes(routes, ctx);
    routesWithV1.all('*', notfound(ctx));
    return routesWithV1;
  };
}
