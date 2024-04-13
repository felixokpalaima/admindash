import { Elysia } from 'elysia';
import getAllTxns from '../controllers/transactions/getAllTxns';
import getTxn from '../controllers/transactions/getTxn';
import {
  CancelTransaction,
  FilterTxnsReq,
  GetTxnReq,
  GetTxnsReq,
  GetUserTxnsReq,
  RefreshCryptoTransaction,
  RetryTransaction,
  getTxnDefaultRes
} from '../validations/getTxns';
import getUserTxns from '../controllers/transactions/getUserTxns';
import filterTxns from '../controllers/transactions/filterTxns';
import { authorize } from '../hooks/authentication';
import { Roles } from '../types/enums';
import refreshCryptoTransaction from '../controllers/transactions/refreshCryptoTransaction';
import retryTransaction from '../controllers/transactions/retryTransaction';
import cancelTransaction from '../controllers/transactions/cancelTransaction';
import getSupportedCurrencies from '../controllers/transactions/supportedCurrencies';

export default function getTxnRoutes(router: Elysia, ctx: RequestContext) {
  const txnsRoutes = router.group('/transactions', (txnRoutes) => {
    txnRoutes.get('/', getAllTxns(ctx), {
      query: GetTxnsReq,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Get all transactions, filter transactions'
      }
    });
    txnRoutes.get('/search', getAllTxns(ctx), {
      query: GetTxnsReq,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Search the transactions db'
      }
    });
    txnRoutes.get('/get', getTxn(ctx), {
      query: GetTxnReq,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Get a single transaction'
      }
    });
    txnRoutes.get('/txns', getUserTxns(ctx), {
      query: GetUserTxnsReq,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        deprecated: true
      }
    });
    txnRoutes.get('/filter', filterTxns(ctx), {
      query: FilterTxnsReq,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        deprecated: true
      }
    });
    txnRoutes.put('/refresh-crypto-transaction', refreshCryptoTransaction(ctx), {
      body: RefreshCryptoTransaction,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Force refresh of a crypto transaction'
      }
    });
    txnRoutes.put('/retrytransaction', retryTransaction(ctx), {
      body: RetryTransaction,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Retry a fiat (NGN) transaction'
      }
    });
    txnRoutes.put('/canceltransaction', cancelTransaction(ctx), {
      body: CancelTransaction,
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.superAdmin]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Cancel a (fiat) transaction'
      }
    });
    txnRoutes.get('/currencies', getSupportedCurrencies(ctx), {
      response: getTxnDefaultRes,
      beforeHandle: [authorize([Roles.customerSuccess, Roles.developer, Roles.manager]) as any],
      detail: {
        tags: ['Transactions'],
        description: 'Get supported currencies'
      }
    });
    return txnRoutes;
  });
  return txnsRoutes;
}
