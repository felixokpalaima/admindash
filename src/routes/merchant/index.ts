import { Elysia } from 'elysia';
import authRoutes from './auth';
import transactionroutes from './transactions';
import balances from './balances';
import settingsRoutes from './settings';
export default function merchantRoutes(router: Elysia, ctx: RequestContext) {
  const merchantRoutes = router.group('/merchant', (merchantRoute) => {
    merchantRoute.use(authRoutes(router, ctx));
    merchantRoute.use(transactionroutes(router, ctx));
    merchantRoute.use(balances(router, ctx));
    merchantRoute.use(settingsRoutes(router, ctx));

    return merchantRoute;
  });
  return merchantRoutes;
}
