export const ventogramTransactionDetail: VentogramTransactionSchema = {
  fromPrevBalance: 0,
  toPrevBalance: 0,
  toAmount: 0,
  toCurrency: '',
  fromAmount: 0,
  fromCurrency: '',
  fromAccount: '',
  toAccount: '',
  fee: 0,
  rate: 0,
  transactionType: '',
  status: '',
  fromReference: '',
  toReference: '',
  txnCount: 0,
  allTxnCount: 0,
  transactionId: '',
  note: '',
  version: '',
  merchantFee: 0,
  voucherFee: 0,
  externalNote: '',
  voucherFeeCurrency: ''
};

export const voucherDetail: VentogramVoucherSchema = {
  id: '',
  email: '',
  amount: 0,
  fee: 0,
  currency: '',
  feeBearer: '',
  expectedAmount: 0,
  fullname: '',
  code: '',
  paymentStatus: '',
  paymentId: '',
  accountNumber: '',
  accountName: '',
  bankCode: '',
  bankName: '',
  paymentExpiresAt: '',
  merchant: '',
  memo: '',
  threadTs: '',
  waivedFee: 0,
  accountProvider: '',
  accountType: '',
  version: '',
  createdAt: '',
  updatedAt: ''
};

export const merchantBalance: MerchantBalance = {
  merchant: '',
  txnCount: 0,
  currency: '',
  amount: 0
};

export const merchantsData: MerchantData = {
  id: '',
  username: '',
  email: '',
  callbackUrl: '',
  logo: '',
  createdAt: '',
  updatedAt: '',
  creditCurrency: '',
  feeBearer: '',
  endpointId: '',
  redeemVoucherUrl: '',
  vipRem: 0,
  slackChannelId: ''
};
