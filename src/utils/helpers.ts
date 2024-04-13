import { v4 } from 'uuid';
import { TransactionTypes } from '../types/enums';
import { bendGateway } from '../gateways/bend';

const generateId = () => v4().replace(/-/g, '');

const sorter = function (result: any) {
  result = result.sort(function (a: any, b: any) {
    return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
  });
  return result;
};

const calcQueryParams = function (page: number, perPage: number) {
  const limit = perPage;
  const offset = (page - 1) * limit;

  return { limit, offset };
};

const contructFilter = function (filters: any) {
  let result = '';
  if (Object.keys(filters).length === 0) {
    return 'AND';
  }
  for (const field in filters) {
    let filter = filters[field];
    result += `${field} = ${filter} AND `;
  }
  let trimmed = result.trim().replace(/AND$/, '').trim();
  return `(${trimmed})`;
};

const fixAmounts = function (
  amount: number | undefined,
  currency: string,
  isUnit: boolean = false
) {
  if (!amount) {
    return '0';
  }

  if (amount === 0 || amount < 0) {
    return '0';
  }
  if (isUnit) {
    amount = amount / 100;
  }
  const currencyMap: CurrencyMap = {
    BTC: 8,
    ETH: 18
  };
  const toLocaleStringOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: currencyMap[currency as keyof CurrencyMap] || 2
  };

  return amount.toLocaleString(undefined, toLocaleStringOptions);
};

const onOrOffRampMerchantBalancesCalculator = (transaction: any) => {
  const {
    source,
    toAmount,
    toPrevBalance,
    fromPrevBalance,
    toCurrency,
    voucherFee,
    fee,
    note,
    transactionType,
    fromCurrency
  } = transaction;
  if (transactionType === 'voucher') return {};
  return {
    currentBalance:
      source === 'ventogram/transactions'
        ? `${toCurrency} ${fixAmounts(
            fromPrevBalance / 100 - Number((Number(voucherFee) + Number(fee)).toFixed(2)),
            toCurrency
          )}`
        : `${toCurrency} ${fixAmounts(fromPrevBalance - toAmount, toCurrency)}`,
    prevBalance:
      source === 'ventogram/transactions'
        ? `${toCurrency} ${fixAmounts(fromPrevBalance / 100, toCurrency)}`
        : `${toCurrency} ${fixAmounts(fromPrevBalance, toCurrency)}`,
    fee:
      source === 'ventogram/transactions'
        ? `${(Number(voucherFee) + Number(fee)).toFixed(2)}`
        : note.replace('USDFee:', ``)
  };
};

const voucherMerchantBalancesCalculator = (transaction: any) => {
  const {
    source,
    toAmount,
    toPrevBalance,
    fromPrevBalance,
    toCurrency,
    voucherFee,
    fee,
    note,
    transactionType,
    fromCurrency
  } = transaction;
  if (note === 'manual funding') {
    return {
      currentBalance:
        source === 'ventogram/transactions'
          ? `${toCurrency} ${fixAmounts(toPrevBalance / 100 + toAmount, toCurrency)}`
          : `${toCurrency} ${fixAmounts(toPrevBalance + toAmount, toCurrency)}`,
      prevBalance:
        source === 'ventogram/transactions'
          ? `${toCurrency} ${fixAmounts(toPrevBalance / 100, toCurrency)}`
          : `${toCurrency} ${fixAmounts(toPrevBalance, toCurrency)}`,
      fee:
        source === 'ventogram/transactions' ? `${(Number(voucherFee) + Number(fee)).toFixed(2)}` : 0
    };
  }
  if (note === 'manual withdrawal') {
    return {
      currentBalance:
        source === 'ventogram/transactions'
          ? `${toCurrency} ${fixAmounts(fromPrevBalance / 100 - toAmount, toCurrency)}`
          : `${toCurrency} ${fixAmounts(toPrevBalance - toAmount, toCurrency)}`,
      prevBalance:
        source === 'ventogram/transactions'
          ? `${toCurrency} ${fixAmounts(fromPrevBalance / 100, toCurrency)}`
          : `${toCurrency} ${fixAmounts(toPrevBalance, toCurrency)}`,
      fee:
        source === 'ventogram/transactions' ? `${(Number(voucherFee) + Number(fee)).toFixed(2)}` : 0
    };
  }
  return {
    currentBalance:
      source === 'ventogram/transactions'
        ? `${toCurrency} ${fixAmounts(fromPrevBalance / 100 + toAmount, toCurrency)}`
        : `${toCurrency} ${fixAmounts(fromPrevBalance - toAmount, toCurrency)}`,
    prevBalance:
      source === 'ventogram/transactions'
        ? `${toCurrency} ${fixAmounts(fromPrevBalance / 100, toCurrency)}`
        : `${toCurrency} ${fixAmounts(fromPrevBalance, toCurrency)}`,
    fee:
      source === 'ventogram/transactions' ? `${(Number(voucherFee) + Number(fee)).toFixed(2)}` : 0
  };
};
const merchantBalanceTransferCalculator = (transaction: any) => {
  const { source, fromPrevBalance, fromCurrency, fromAmount } = transaction;
  if (source === 'ventogram/transactions') {
    return {
      prevBalance: `${fromCurrency} ${fixAmounts(fromPrevBalance / 100, fromCurrency)}`,
      currentBalance: `${fromCurrency} ${fixAmounts(fromPrevBalance / 100 - fromAmount, fromCurrency)}`
    };
  }
  return {};
};

const calcMerchantBalances = function (transaction: any) {
  const { transactionType } = transaction;
  const balancesMap = {
    offramp: () => onOrOffRampMerchantBalancesCalculator(transaction),
    onramp: () => onOrOffRampMerchantBalancesCalculator(transaction),
    voucher: () => voucherMerchantBalancesCalculator(transaction),
    withdrawal: () => voucherMerchantBalancesCalculator(transaction),
    transfer: () => merchantBalanceTransferCalculator(transaction)
  };
  if (!(balancesMap as any)[transactionType]) {
    return {};
  }
  return (balancesMap as any)[transactionType]();
};

const renameTransactionFields = function (transaction: any, account: string) {
  let {
    fromAccount,
    toAccount,
    fromAmount,
    toAmount,
    transactionType,
    toCurrency,
    fromCurrency,
    toPrevBalance = 0,
    fromPrevBalance = 0,
    isMerchantBalanceTransfer,
    fromBalance,
    toBalance
  } = transaction;
  const accountPostions: any = {
    [fromAccount]: 'from',
    [toAccount]: 'to'
  };
  if (!transaction.fromPrevBalance) {
    transaction['fromPrevBalance'] = 0;
  }

  let primaryAccountPostion = accountPostions[account];
  if (transactionType === TransactionTypes.conversion) {
    primaryAccountPostion = 'from';
  }

  const fromOrTo = {
    onramp: { amount: 'to', currency: 'to', prevBalance: primaryAccountPostion },
    payout: { amount: 'to', currency: 'to', prevBalance: primaryAccountPostion },
    voucher: { amount: 'from', currency: 'from', prevBalance: primaryAccountPostion },
    withdrawal: {
      amount: 'to',
      currency: 'to',
      prevBalance: primaryAccountPostion
    },
    transfer: {
      amount: 'from',
      currency: 'from',
      prevBalance: primaryAccountPostion
    },
    offramp: {
      amount: 'from',
      currency: 'from',
      prevBalance: primaryAccountPostion
    },
    refund: { amount: 'to', currency: 'to', prevBalance: primaryAccountPostion },
    conversion: { amount: 'to', currency: 'to', prevBalance: primaryAccountPostion },
    deposit: { amount: 'to', currency: 'to', prevBalance: primaryAccountPostion }
  };
  const currenciesMap = {
    toCurrency,
    fromCurrency
  };

  const res = {} as any;
  const fields: any = {
    id: `id`,
    prevBalance: `${fromOrTo[transactionType as keyof typeof fromOrTo].prevBalance}PrevBalance`,
    receiverBank: `toAccount`,
    sessionId: `sessionId`,
    email: `email`,
    username: `toAccount`,
    receiverWallet: `toAccount`,
    transactionHash: `transactionHash`,
    sender: `fromAccount`,
    transactionType: `transactionType`,
    date: `date`,
    rate: `rate`,
    fee: `fee`,
    status: `status`,
    merchantFee: `merchantFee`,
    voucherFee: 'voucherFee',
    voucherFeeCurrency: 'voucherFeeCurrency',
    feeCurrency: transactionType == 'onramp' ? `voucherFeeCurrency` : `fromCurrency`,
    note: `note`,
    externalNote: `externalNote`,
    network: `network`,
    transactionId: `transactionId`,
    failureReason: transaction.status === 'failed' ? `note` : undefined,
    amount: `${fromOrTo[transactionType as keyof typeof fromOrTo].amount}Amount`,
    currency: `${fromOrTo[transactionType as keyof typeof fromOrTo].currency}Currency`,
    currentBalance: ``,
    fromReference: transaction[`fromReference`]
      ? `fromReference`
      : transaction[`transactionId`]
        ? `transactionId`
        : `id`
  };
  for (const field in fields) {
    let value = fields[field];
    res[field] = transaction[value];
  }
  if (isMerchantBalanceTransfer) {
    res['username'] = toBalance;
    res['sender'] = fromBalance;
    res['isMerchantBalanceTransfer'] = isMerchantBalanceTransfer;
  }
  if (transactionType === TransactionTypes.conversion) {
    res['fromAmount'] = fromAmount;
    res['fromCurrency'] = fromCurrency;
  }

  if (!res['rate']) {
    res['rate'] = fromAmount / toAmount >= 1 ? fromAmount / toAmount : toAmount / fromAmount;
  }
  if (!res['fee']) {
    res['fee'] = 0;
  }
  if (!res['date']) {
    res['date'] = transaction.createdAt;
  }

  primaryAccountPostion === 'to'
    ? (res['currentBalance'] = `${toCurrency} ${fixAmounts(toPrevBalance + toAmount, toCurrency)}`)
    : (res['currentBalance'] = `${fromCurrency} ${fixAmounts(
        fromPrevBalance - fromAmount,
        fromCurrency
      )}`);
  let prevBalanceCurrency = `${
    fromOrTo[transactionType as keyof typeof fromOrTo].prevBalance
  }Currency`;

  res['prevBalance'] = `${currenciesMap[prevBalanceCurrency as keyof typeof currenciesMap]} ${
    fixAmounts(
      res['prevBalance'],
      currenciesMap[prevBalanceCurrency as keyof typeof currenciesMap]
    ) || 0
  }`;

  res['amount'] = fixAmounts(res['amount'], res['currency']);
  for (const field in res) {
    if (typeof res[field] === 'number') {
      res[field] = res[field].toFixed(2);
    }
  }

  return { ...res, ...calcMerchantBalances(transaction) };
};

const mapAppEnv = (envValue: string) => {
  return (
    {
      dev: 'development',
      development: 'development',
      staging: 'staging',
      alpha: 'production',
      production: 'production'
    }[envValue] || 'development'
  );
};

const getterMap = {
  voucher: `fromReference`,
  payout: `transactionId`,
  offramp: `paymentId`,
  withdrawal: `transactionId`,
  onramp: `fromReference`,
  transfer: `transactionId`,
  refund: `transactionId`,
  conversion: `transactionId`,
  deposit: `transactionId`
};

const propertiesMap = {
  voucher: `receiverBank`
};

const formBalances = (
  balances: Array<MerchantBalance | BalanceV2> | null,
  defaultBalances: Array<BalancesRecord> = [
    { currency: 'NGN', amount: 0 },
    { currency: 'USD', amount: 0 }
  ]
) => {
  const currencyFormatter = {
    NGN: 2,
    USD: 2
  };
  if (!balances) {
    return defaultBalances;
  }
  return defaultBalances.map((defaultBalance: BalancesRecord) => {
    const isBalancePresent = balances.filter(
      (balance) => balance.currency === defaultBalance.currency
    );
    const { currency, amount } = isBalancePresent[0] || {};
    return isBalancePresent.length === 0
      ? defaultBalance
      : {
          currency,
          amount: amount / 10 ** currencyFormatter[currency as keyof typeof currencyFormatter]
        };
  });
};

const formWaasBalances = (
  balances: Array<WaasAddress> | null,
  defaultBalances: Array<BalancesRecord> = [{ currency: 'BTC', amount: 0 }]
) => {
  const currencyFormatter = {
    BTC: 8
  };
  if (!balances) {
    return defaultBalances;
  }
  return defaultBalances.map((defaultBalance: BalancesRecord) => {
    const isBalancePresent = balances.filter(
      (balance) => balance.currency === defaultBalance.currency
    );
    const { currency, newFormattedBalance } = isBalancePresent[0] || {};
    return isBalancePresent.length === 0
      ? defaultBalance
      : {
          currency,
          amount: Number(
            newFormattedBalance.toFixed(
              currencyFormatter[currency as keyof typeof currencyFormatter]
            )
          )
        };
  });
};

function debounce(func: (...args: any[]) => any, timeout: number = 300) {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

async function delay(min = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), min * 1000 * 60);
  });
}

async function sendOtp({ purpose, currency, amount, account, token }: sendOTPReqBody) {
  try {
    const payload = {
      purpose,
      data: {
        currency,
        amount,
        account
      }
    };

    return await bendGateway.makeRequest({
      otherHeaders: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      path: `/v2/auth/send-otp`,
      payload
    });
  } catch (err: any) {
    throw new Error('Could not send OTP', err.message);
  }
}

export {
  generateId,
  sorter,
  calcQueryParams,
  contructFilter,
  renameTransactionFields,
  mapAppEnv,
  fixAmounts,
  getterMap,
  propertiesMap,
  formBalances,
  formWaasBalances,
  debounce,
  delay,
  sendOtp
};

export default {
  generateId,
  sorter,
  calcQueryParams,
  contructFilter,
  renameTransactionFields,
  mapAppEnv,
  fixAmounts,
  getterMap,
  propertiesMap,
  formBalances,
  formWaasBalances,
  debounce,
  delay,
  sendOtp
};
