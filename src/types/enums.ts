export enum Roles {
  superAdmin = 'superadmin',
  customerSuccess = 'customersuccess',
  developer = 'developer',
  manager = 'manager',
  user = 'user'
}

export enum KycMerchant {
  persona = 'persona',
  mono = 'mono'
}

export enum Side {
  Sell = 'sell',
  Buy = 'buy'
}

export enum TransactionTypes {
  onramp = 'onramp',
  offramp = 'offramp',
  withdrawal = 'withdrawal',
  payout = 'payout',
  voucher = 'voucher',
  transfer = 'transfer',
  refund = 'refund',
  conversion = 'conversion',
  deposit = 'deposit'
}

export enum InternalMerchantBalances {
  collection = 'collection',
  payout = 'payout'
}
