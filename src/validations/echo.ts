import { t } from 'elysia';

export const EchoReq = t.Object({
  message: t.Numeric()
});

export const EchoRes = t.Object({
  message: t.String(),
  data: t.Optional(t.Numeric())
});
