import { t } from 'elysia';

export const getUsersReq = t.Object({
  perPage: t.Numeric(),
  page: t.Numeric(),
  query: t.Optional(t.String())
});

export const getUsersRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const getUserReq = t.Object({
  username: t.Optional(t.String()),
  email: t.Optional(t.String())
});

export const getUserRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const searchReq = t.Object({
  query: t.String()
});

export const disableTwoFaReq = t.Object({
  username: t.String()
});

// export const disableTwoFaRes = t.Object({
//   success: t.Optional(t.Boolean()),
//   message: t.Optional(t.String()),
//   status: t.Numeric(),
//   data: t.Optional(t.Object({})),
// });
export const disableTwoFaRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const manageWithdrawalReq = t.Object({
  canWithdraw: t.Boolean(),
  username: t.String(),
  totp: t.String()
});

export const manageWithdrawalRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const manageKycReq = t.Object({
  username: t.String(),
  kycLevel: t.Numeric()
});

export const manageKycRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const defundUserReq = t.Object({
  amount: t.Numeric(),
  currency: t.String(),
  reason: t.String(),
  username: t.String()
});

export const defundUserRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});

export const resetAttempts = t.Object({
  email: t.String()
});

export const defaultRes = t.Object({
  success: t.Optional(t.Boolean()),
  message: t.String(),
  data: t.Optional(t.Object({})),
  status: t.Numeric()
});
