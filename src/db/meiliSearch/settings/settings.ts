import getConfig from '../../../config';
import {
  txnFieldOnMeili,
  mapBizAndVentogramTxnToTxnOnMeili,
  reshapeMeiliTxn
} from './transactionSettings';
const config = getConfig();
const settings: FetchAndMergeSettings = {
  remote: {
    ventogram: {
      uri: config.DB_CONN_STRINGS.ventogram!,
      collections: ['transactions']
    },
    biz: {
      uri: config.DB_CONN_STRINGS.biz!,
      collections: ['transactiondetails']
    }
  },
  mergeCollections: {
    Transactions: {
      mergeThese: [
        { location: 'ventogram', collection: 'transactions' },
        { location: 'biz', collection: 'transactiondetails' }
      ],
      mergeShape: {
        markedFields: txnFieldOnMeili,
        resolveUnmarkedFields: mapBizAndVentogramTxnToTxnOnMeili,
        merger: (shape: any, doc: any) => reshapeMeiliTxn(shape, doc)
      },
      databaseSettings: {
        searchableAttributes: [
          'fromAccount',
          'toAccount',
          'fromReference',
          'toReference',
          'source',
          'envType',
          'status',
          'transactionType',
          'transactionId',
          'fromCurrency',
          'toCurrency',
        ],
        sortableAttributes: ['createdAt'],
        filterableAttributes: [
          'fromAccount',
          'toAccount',
          'fromReference',
          'toReference',
          'source',
          'envType',
          'status',
          'transactionType',
          'transactionId',
          'fromCurrency',
          'toCurrency',
        ],
        pagination: {
          maxTotalHits: 5000
        }
      }
    }
  }
};

export default settings;
