import { Elysia } from 'elysia';
import { Roles } from '../../types/enums';
import getAll from '../../controllers/merchants/transactions/getTransactions';
import getOne from '../../controllers/merchants/transactions/getTransaction';
import { authorizeMerchant } from '../../hooks/authentication';
import { defaultMerchantRes, getTransactionReq } from '../../validations/merchant';

export default function transactions(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  const transactionRoutes = router.group('/transactions', (transactionRoute) => {
    transactionRoute.get('/', getAll(ctx), {
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user, Roles.customerSuccess], ctx, false) as any]
    });
    transactionRoute.get('/get', getOne(ctx), {
      query: getTransactionReq,
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user, Roles.customerSuccess], ctx, false) as any]
    });

    return transactionRoute;
  });
  return transactionRoutes;
}
