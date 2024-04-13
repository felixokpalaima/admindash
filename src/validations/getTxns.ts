import { t } from 'elysia';

export const GetTxnsReq = t.Object({
  perPage: t.Optional(t.Numeric()),
  page: t.Optional(t.Numeric()),
  query: t.Optional(t.String()),
  currency: t.Optional(t.String()),
  type: t.Optional(t.String()),
  status: t.Optional(t.String()),
  username: t.Optional(t.String())
});

export const GetTxnReq = t.Object({
  transactionId: t.String()
});

export const GetUserTxnsReq = t.Object({
  perPage: t.Numeric(),
  page: t.Numeric(),
  email: t.Optional(t.String()),
  username: t.Optional(t.String())
});

export const FilterTxnsReq = t.Object({
  perPage: t.Numeric(),
  page: t.Numeric(),
  username: t.Optional(t.String()),
  currency: t.Optional(t.String()),
  status: t.Optional(t.String()),
  type: t.Optional(t.String())
});

export const txnDefaultRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const RefreshCryptoTransaction = t.Object({
  businessId: t.String(),
  transactionId: t.String()
});

export const RetryTransaction = t.Object({
  id: t.String(),
  service: t.String(),
  accountNumber: t.String(),
  account: t.String(),
  bankCode: t.String(),
  bankName: t.String()
});

export const CancelTransaction = t.Object({
  transactionId: t.String()
});

export const getTxnDefaultRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});
