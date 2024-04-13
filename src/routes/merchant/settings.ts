import { Elysia } from 'elysia';
import { authorizeMerchant } from '../../hooks/authentication';
import { Roles } from '../../types/enums';
import { defaultMerchantRes } from '../../validations/merchant';
import getAccountEmails from '../../controllers/merchants/merchant/getAccountEmails';

export default function settingsRouters(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  const settingsRoutes = router.group('/settings', (settingsRoute) => {
    settingsRoute.get('/emails', getAccountEmails(ctx), {
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user, Roles.customerSuccess], ctx) as any]
    });
    return settingsRoute;
  });
  return settingsRoutes;
}
