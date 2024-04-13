import { Elysia } from 'elysia';
import { authorizeMerchant } from '../../hooks/authentication';
import { Roles } from '../../types/enums';
import getMerchant from '../../controllers/merchants/merchant/getMerchant';
import inviteMerchant from '../../controllers/merchants/merchant/inviteAccount';
import {
  completePasswordlessLogin,
  defaultMerchantRes,
  startLogin,
  inviteSub
} from '../../validations/merchant';
import passwordlessLogin from '../../controllers/merchants/merchant/passwordlessLogin';
import completeLogin from '../../controllers/merchants/merchant/completeLogin';

export default function authRouters(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  const authRoutes = router.group('/auth', (authRoute) => {
    authRoute.post('/', getMerchant(ctx), {
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user, Roles.customerSuccess], ctx) as any]
    });
    authRoute.post('/invite', inviteMerchant(ctx), {
      body: inviteSub,
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user], ctx) as any]
    });
    authRoute.post('/login', passwordlessLogin(ctx), {
      body: startLogin,
      response: defaultMerchantRes
    });
    authRoute.post('/complete-login', completeLogin(ctx), {
      body: completePasswordlessLogin,
      response: defaultMerchantRes
    });
    return authRoute;
  });
  return authRoutes;
}
