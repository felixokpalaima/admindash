import Elysia from 'elysia';
import db from './meiliOps';

export default function dbRoute(router: Elysia, ctx: RequestContext) {
  const dbRoutes = router.group('/db', (dbRoute) => {
    dbRoute.use(db(router, ctx));

    return dbRoute;
  });
  return dbRoutes;
}
