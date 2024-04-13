import {
  BalanceV2,
  Kycs,
  bizMissedMeiliRecords,
  UsersV2,
  UserTransactionDetail,
  payouts,
  paymentV2
} from './biz';
import {
  merchantBalance,
  merchantsData,
  ventogramTransactionDetail,
  voucherDetail
} from './ventogram';
import { WaasAddress } from './waas';

export const dbSchema = Object.freeze({
  biz: {
    usersV2: {
      ...UsersV2
    },
    transactiondetails: {
      ...UserTransactionDetail
    },
    balancev2: {
      ...BalanceV2
    },
    kycs: {
      ...Kycs
    },
    missedMeiliRecords: {
      ...bizMissedMeiliRecords
    },
    payouts: {
      ...payouts
    },
    paymentv2: {
      ...paymentV2
    }
  },
  cards: {
    cards: {
      coinprofileCardUserID: '',
      merchant: '',
      merchantCardId: ''
    }
  },
  waas: {
    apps: {
      name: '',
      uid: ''
    },
    addresss: {
      ...WaasAddress
    }
  },
  ventogram: {
    transactions: {
      ...ventogramTransactionDetail
    },
    vouchers: {
      ...voucherDetail
    },
    merchantbalances: {
      ...merchantBalance
    },
    merchants: {
      ...merchantsData
    }
  }
});

export type SchemaType = typeof dbSchema;
