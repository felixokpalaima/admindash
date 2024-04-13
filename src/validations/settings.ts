import { t } from 'elysia';

export const SetRateReq = t.Object({
  type: t.String(),
  margin: t.Numeric()
});

export const DefaultRateRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});
