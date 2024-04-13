import Elysia from 'elysia';
import getRateRoutes from './rates';

export default function getSettingsRoutes(router: Elysia, ctx: RequestContext) {
  const settingsRoutes = router.group('/settings', (settingsRoute) => {
    settingsRoute.use(getRateRoutes(router, ctx));
    return settingsRoute;
  });

  return settingsRoutes;
}
