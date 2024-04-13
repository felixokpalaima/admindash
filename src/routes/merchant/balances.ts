import { Elysia } from 'elysia';
import { Roles } from '../../types/enums';
import { authorizeBalanceTransfer, authorizeMerchant } from '../../hooks/authentication';
import getBalances from '../../controllers/merchants/balances/getBalances';
import {
  balanceTransferInitialization,
  completeBalanceTransfer,
  defaultMerchantRes
} from '../../validations/merchant';
import collectionTransfer from '../../controllers/merchants/balances/collectionTransfer';
import payoutTransfer from '../../controllers/merchants/balances/payoutTransfer';
import payoutTransferOtp from '../../controllers/merchants/balances/payoutTransferOtp';

export default function balances(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  const balanceRoutes = router.group('/balances', (balanceRoute) => {
    balanceRoute.get('/', getBalances(ctx), {
      response: defaultMerchantRes,
      beforeHandle: [authorizeMerchant([Roles.user, Roles.customerSuccess], ctx, false) as any]
    });
    balanceRoute.post('/collection-transfer', collectionTransfer(ctx), {
      body: balanceTransferInitialization,
      response: defaultMerchantRes,
      beforeHandle: [
        authorizeMerchant([Roles.user], ctx, false) as any,
        (req: any) => authorizeBalanceTransfer(ctx, req)(req)
      ]
    });
    balanceRoute.post('/payout-transfer', payoutTransfer(ctx), {
      body: completeBalanceTransfer,
      response: defaultMerchantRes,
      beforeHandle: [
        authorizeMerchant([Roles.user], ctx, false) as any,
        (req: any) => authorizeBalanceTransfer(ctx, req)(req)
      ]
    });
    balanceRoute.post('/payout-transfer-otp', payoutTransferOtp(ctx), {
      body: balanceTransferInitialization,
      response: defaultMerchantRes,
      beforeHandle: [
        authorizeMerchant([Roles.user], ctx, false) as any,
        (req: any) => authorizeBalanceTransfer(ctx, req)(req)
      ]
    });
    return balanceRoute;
  });
  return balanceRoutes;
}
