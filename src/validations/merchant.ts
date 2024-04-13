import { t } from 'elysia';

export const getMerchantReq = t.Object({
  mfaCode: t.Numeric()
});

export const getTransactionReq = t.Object({
  id: t.String()
});

export const inviteSub = t.Object({
  email: t.String(),
  roles: t.Optional(t.Array(t.String()))
});

export const startLogin = t.Object({
  email: t.String()
});

export const completePasswordlessLogin = t.Object({
  code: t.String()
});

export const defaultMerchantRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

const Currency = t.Union([t.Literal('NGN'), t.Literal('USD')]);

const amountRegex = '^(?!0+(\\.0+)?$)\\d*(\\.\\d{1,2})?$';

export const balanceTransferInitialization = t.Object({
  amount: t.String({ pattern: amountRegex }),
  currency: Currency
});

export const completeBalanceTransfer = t.Object({
  amount: t.String({ pattern: amountRegex }),
  currency: Currency,
  receiveCurrency: t.String(),
  otp: t.String(),
  otpType: t.String()
});
