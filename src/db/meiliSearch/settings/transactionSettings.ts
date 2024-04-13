import getConfig from '../../../config';
import { InternalMerchantBalances, TransactionTypes } from '../../../types/enums';
import { mapAppEnv } from '../../../utils/helpers';

const config = getConfig();

const transactionTypeMap = config.TXN_TYPE_MAP as MeilisearchMaps;
const bizAccountMap = config.BIZ_ACCOUNT_MAP as MeilisearchMaps;
const ventogramAccountMap = config.VENTOGRAM_ACCOUNT_MAP as MeilisearchMaps;
const currencyMap = config.CURRENCY_MAP as MeilisearchMaps;
const mapBizAndVentogramTxnToTxnOnMeili = config.FORMAT_FIELD_NAMES as MeilisearchMaps;
const bizTxnTypes = config.BIZ_TXN_MAP as MeilisearchMaps;
const ventogramTxnTypes = config.VENTOGRAM_TRANSACTION_MAP as MeilisearchMaps;

const txnFieldOnMeili = [
  'fromPrevBalance',
  'fromAmount',
  'fromCurrency',
  'fromAccount',
  'fromReference',
  'toPrevBalance',
  'toAmount',
  'toCurrency',
  'toAccount',
  'toReference',
  'rate',
  'fee',
  'merchantFee',
  'transactionType',
  'status',
  'txnCount',
  'allTxnCount',
  'transactionId',
  'note',
  'externalNote',
  'voucherFee',
  'voucherFeeCurrency',
  'date',
  'paymentId',
  'businessId',
  'network',
  'transferId',
  'accountType',
  'paymentMethod',
  'recipientAddress',
  'threadTs',
  'isFromRegUser',
  'createdAt',
  'updatedAt',
  'envType',
  'createdAtTimestamp',
  'source'
];

function mapBizTxnType(doc: any, bizTxnTypes: any) {
  let {
    fromAmount,
    toAmount,
    fromAccount,
    toAccount,
    transactionType,
    fromCurrency,
    toCurrency,
    status,
    note,
    transactionId
  } = doc;
  if (status === 'fullfiled') {
    doc.status = 'completed';
  }
  if (!fromAmount) {
    doc['fromAmount'] = toAmount;
  }
  if (!fromCurrency) {
    doc['fromCurrency'] = toCurrency;
  }
  if ((note as string)?.startsWith('Wallet Withdrawal to:')) {
    toAccount = (note as string).replace('Wallet Withdrawal to:', '');
    return { ...doc, transactionType: TransactionTypes.withdrawal, toAccount };
  }
  if (toCurrency === 'BTC' && transactionType === TransactionTypes.withdrawal) {
    return { ...doc, transactionType: TransactionTypes.withdrawal };
  }

  if (
    fromAccount === '@refund' ||
    (transactionId as string)?.startsWith('refund') ||
    (note as string)?.startsWith('refund')
  ) {
    return { ...doc, transactionType: TransactionTypes.refund };
  }
  if (fromAccount === 'ventogram' && transactionType === 'internalTransfer') {
    return { ...doc, transactionType: TransactionTypes.transfer, expires: true };
  }

  if (toAccount == 'ventogram') {
    return {
      ...doc,
      transactionType: TransactionTypes.transfer,
      isMerchantBalanceTransfer: true,
      fromBalance: InternalMerchantBalances.payout,
      toBalance: InternalMerchantBalances.collection
    };
  }
  const transactionTypeMap: Record<string, TransactionTypes> = {
    withdrawal: TransactionTypes.payout,
    sent: TransactionTypes.offramp,
    conversion: TransactionTypes.conversion,
    internalTransfer: TransactionTypes.transfer,
    deposit: TransactionTypes.deposit,
    transfer: TransactionTypes.transfer //refund
  };

  let result = transactionTypeMap[transactionType as string];
  return { ...doc, transactionType: result };
}

function mapVenotgramTxnType(doc: any, ventogramTxnTypes: any) {
  let { fromAccount, toAccount, transactionType } = doc;

  let result: TransactionTypes;

  if (transactionType === 'withdrawal') {
    if (toAccount !== fromAccount) {
      result = TransactionTypes.onramp;
    } else {
      result = TransactionTypes.transfer;
    }
  } else {
    if (toAccount !== fromAccount) {
      result = TransactionTypes.transfer;
    } else {
      result = TransactionTypes.voucher;
    }
  }

  if (
    result == TransactionTypes.transfer &&
    transactionType == 'withdrawal' &&
    toAccount == fromAccount
  ) {
    return {
      ...doc,
      transactionType: result,
      isMerchantBalanceTransfer: true,
      fromBalance: InternalMerchantBalances.collection,
      toBalance: InternalMerchantBalances.payout
    };
  }
  if (
    result == TransactionTypes.transfer &&
    transactionType == 'deposit' &&
    toAccount !== fromAccount
  ) {
    return { ...doc, transactionType: result, expires: true };
  }

  return { ...doc, transactionType: result };
}

function reshapeMeiliTxn(shape: any, doc: any): any {
  const { markedFields, resolveUnmarkedFields } = shape;
  const { source, _id, createdAt } = doc;
  const meiliDoc = {
    version: 'v1.0',
    source: source,
    id: _id.toString(),
    envType: mapAppEnv(config.APP_ENV),
    createdAtTimestamp: new Date(createdAt).getTime()
  } as any; //id should be newly generated
  for (const field in doc) {
    if (markedFields.includes(field)) {
      meiliDoc[field] = doc[field];
    } else if (Object.keys(resolveUnmarkedFields).includes(field)) {
      meiliDoc[resolveUnmarkedFields[field]] = doc[field];
    }
    // else {
    //   meiliDoc.notFound.push(field)
    // }
  }
  if (source === 'biz/transactiondetails') {
    return mapBizTxnType(meiliDoc, bizTxnTypes);
  } else {
    return mapVenotgramTxnType(meiliDoc, ventogramTxnTypes);
  }
}

export {
  currencyMap,
  transactionTypeMap,
  mapBizAndVentogramTxnToTxnOnMeili,
  txnFieldOnMeili,
  reshapeMeiliTxn
};
