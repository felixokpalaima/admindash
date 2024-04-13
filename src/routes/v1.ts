import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import echo from '../controllers/v1placeholder';
import { EchoReq, EchoRes } from '../validations/echo';
import getUserRoutes from './users';
import getTransactionRoutes from './transactions';
import getSettingsRoutes from './settings';
import merchantRoutes from './merchant';
import dbOpsRoute from './db';

export default function getv1Routes(router: Elysia, ctx: RequestContext) {
  const routesWithV1 = router.group('/v1', (v1routes) => {
    v1routes.use(
      swagger({
        documentation: {
          info: {
            title: "Api Documentation For Payourse's Admin Dashboard",
            version: '1.0.0'
          },
          tags: [
            { name: 'Users', description: 'Endpoints to get user(s) details' },
            { name: 'Transactions', description: 'Endpoints to get transaction(s) details' },
            { name: 'Settings', description: 'Endpoints to adjust settings on Payourse' }
          ]
        },
        path: '/docs',
        autoDarkMode: true
      })
    );
    v1routes.use(getUserRoutes(router, ctx));
    v1routes.use(getTransactionRoutes(router, ctx));
    v1routes.use(getSettingsRoutes(router, ctx));
    v1routes.use(merchantRoutes(router, ctx));
    v1routes.use(dbOpsRoute(router, ctx));

    v1routes.get('/echo', echo(ctx), {
      query: EchoReq,
      response: EchoRes
    });

    v1routes.post('/echo', echo(ctx), {
      body: EchoReq,
      response: EchoRes
    });

    return v1routes;
  });
  return routesWithV1;
}
