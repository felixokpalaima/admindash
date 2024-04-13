import { Elysia } from 'elysia';
import { authorize } from '../hooks/authentication';
import { Roles } from '../types/enums';
import getRate from '../controllers/settings/getRates';
import setRate from '../controllers/settings/setRates';
import { DefaultRateRes, SetRateReq } from '../validations/settings';

export default function getRateRoutes(router: Elysia, ctx: RequestContext) {
  router = new Elysia();
  const ratesRoutes = router.group('/rates', (rateRoutes) => {
    rateRoutes.get('/', getRate(ctx), {
      response: DefaultRateRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Settings'],
        description: 'Get current rate'
      }
    });
    rateRoutes.put('/set', setRate(ctx), {
      body: SetRateReq,
      response: DefaultRateRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Settings'],
        description: 'Set rate'
      }
    });
    return rateRoutes;
  });
  return ratesRoutes;
}
