const MFA: MFA = {
  created: '',
  enrolled: '',
  secret: '',
  otp: ''
};

export const UsersV2: UsersV2 = {
  username: '',
  id: '',
  mfa: MFA,
  email: '',
  active: false,
  role: '',
  bio: '',
  lastname: '',
  middlename: '',
  firstname: '',
  fullname: '',
  photo: '',
  profileName: '',
  referrer: '',
  isReferred: false,
  isFirstValidReferralValue: false,
  createdAt: '',
  updatedAt: '',
  phone: '',
  countryCode: '',
  pubKey: '',
  passcode: ''
};

export const UserTransactionDetail: UserTransactionDetail = {
  memo: '',
  internalMemo: '',
  transactionId: '',
  isFromRegUser: false,
  sender: '',
  prevBalance: 0,
  type: '',
  businessId: '',
  date: '',
  paymentId: '',
  fromCurrency: '',
  fromAmount: 0,
  currency: '',
  amount: 0,
  username: '',
  status: '',
  version: '',
  senderPrevbalance: 0,
  fee: 0,
  network: '',
  transferId: '',
  failureReason: '',
  recipientAddress: '',
  accountType: '',
  paymentMethod: '',
  threadTs: ''
};

export const BalanceV2: BalanceV2 = {
  username: '',
  amount: 0,
  txnCount: 0,
  currency: '',
  canWithdraw: false,
  totalRecieved: 0,
  totalSent: 0
};

const UserAddress: UserAddress = {
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  houseNumber: ''
};

export const Kycs: Kycs = {
  username: '',
  kycLevel: 1,
  status: '',
  code: '',
  verificationCountry: '',
  recordId: '',
  verificationMerchant: '',
  otpMerchant: '',
  date: '',
  userAddress: UserAddress,
  idNumber: ''
};

export const bizMissedMeiliRecords: { id: string; source: string; writtenToMeili: boolean } = {
  id: '',
  source: '',
  writtenToMeili: false
};

export const payouts: Payouts = {
  service: '',
  account: '',
  currency: '',
  amount: 0,
  accountName: '',
  accountNumber: '',
  bankCode: '',
  bankName: '',
  reference: '',
  oldReference: '',
  narration: '',
  clientName: '',
  clientSecret: '',
  note: '',
  retryCount: 0,
  cancelled: false,
  status: '',
  version: ''
};

export const paymentV2: PaymentV2 = {
  businessId: '',
  senderUsername: '',
  reference: '',
  incomingAmount: 0,
  incomingCurrency: '',
  outgoingAmount: 0,
  outgoingCurrency: '',
  confirmedAmount: 0,
  unconfirmedAmount: 0,
  expTime: '',
  rate: 0,
  address: '',
  customerEmail: '',
  state: '',
  paymentType: '',
  account: '',
  threadTS: '',
  transactions: {},
  outgoingTransactions: {},
  memo: '',
  resolveId: '',
  internalMemo: '',
  refundAddress: ''
};
