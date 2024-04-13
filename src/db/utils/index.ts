import { dbs } from '..';
import { formBalances, formWaasBalances } from '../../utils/helpers';
import { addDoc, searchDocs, updateDoc } from '../meiliSearch/managers';
import settings from '../meiliSearch/settings/settings';
import { reshapeMeiliTxn } from '../meiliSearch/settings/transactionSettings';
import getConfig from '../../config';
const config = getConfig();
const sourceCollectionMap: Record<string, string> = {
  'biz/transactiondetails': 'Transactions',
  'ventogram/transactions': 'Transactions'
};

const watchDb = (dbs: DBs, names: Array<DbName> = ['biz', 'ventogram']) => {
  const watched: Watched = {
    ventogram: ['transactions'],
    biz: ['transactiondetails']
  };

  const operationMap: OperationMap = {
    create: async (data: any, source: string) => {
      const { fullDocument } = data;
      const insertedDocument = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, {
        ...fullDocument,
        source
      });
      if (insertedDocument.expires) {
        return;
      }
      await addDoc('Transactions', insertedDocument);
    },
    insert: async (data: any, source: string) => {
      const { fullDocument } = data;
      const insertedDocument = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, {
        ...fullDocument,
        source
      });
      if (insertedDocument.expires) {
        return;
      }
      await addDoc('Transactions', insertedDocument);
    },
    update: async (data: any, source: string) => {
      const {
        documentKey: { _id },
        updateDescription: { updatedFields }
      } = data;
      if (updatedFields['status'] === 'fullfiled') {
        updatedFields['status'] = 'completed';
      }
      await updateDoc('Transactions', {
        id: _id.toString(),
        ...updatedFields
      });
    }
  };

  for (const dbName in watched) {
    if (!names.includes(dbName as DbName)) {
      console.log(names, dbName);
      continue;
    }
    const collections = watched[dbName as DbName]!;
    collections.forEach((collectionName) => {
      dbs[dbName as DbName].watchCollection(collectionName, async (data) => {
        try {
          const { operationType } = data;
          await operationMap[operationType as OperationType](data, `${dbName}/${collectionName}`);
        } catch (error) {
          const {
            documentKey: { _id }
          } = data;
          const source = `${dbName}/${collectionName}`;
          const id = _id.toString();
          await dbs['biz'].create('missedMeiliRecords', { id, source, writtenToMeili: false }); //store everything in biz
        }
      });
    });
  }
};
const searchMap: Partial<Record<DbName, CollectionNames>> = {
  biz: 'transactiondetails',
  ventogram: 'transactions'
};

const writeMissingMeiliRecords = async (dbs: DBs) => {
  try {
    const missingDocuments = await getMissingDocuments(dbs, searchMap);
    console.log(missingDocuments.length, missingDocuments);
    if (missingDocuments.length > 0) {
      missingDocuments.forEach(async (doc: any) => {
        const { source } = doc;
        await updateDoc(sourceCollectionMap[source], doc);
      });
    }
    return missingDocuments.length > 0
      ? 'written missing documents to meili'
      : 'no documents to write';
  } catch (error) {
    throw 'could not write missing document to meilisearch';
  }
};

const getMissingDocuments = async (
  dbs: DBs,
  searchMap: Partial<Record<DbName, CollectionNames>>,
  counter: number = 200
) => {
  try {
    let dbName: DbName;
    let result: any = [];
    for (dbName in searchMap) {
      const source = `${dbName}/${searchMap[dbName]}`;
      const meiliDocs = (
        await searchDocs('Transactions', source, {
          sort: ['createdAt:desc'],
          offset: 0,
          limit: counter * 2,
          filter: `envType = ${config.APP_ENV}`
        })
      ).hits;

      const docs =
        (await (dbs[dbName] as any).paginatedGet(searchMap[dbName], {}, counter, 0)).data || [];
      const shapedDocs: any = [];

      docs.forEach((doc: any) => {
        const shapedDoc = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, {
          ...doc,
          source
        });
        if (!shapedDoc.expires) {
          shapedDocs.push(shapedDoc);
        }
      });

      const missingDocs = [...shapedDocs].filter((doc) => {
        const found = meiliDocs.find((meiliDoc) => {
          return meiliDoc.id === doc.id;
        });
        return !found;
      });

      result = [...result, ...missingDocs];
    }
    return result;
  } catch (error) {
    throw 'could not get missing documents';
  }
};

const countDocumentsInCollection = async (
  dbs: DBs,
  dbName: DbName,
  collectionName: string
): Promise<number> => {
  const collectionCount = await dbs[dbName].countDocuments(collectionName);
  return collectionCount;
};

async function getPayoutDetails(transactionId: string, dbs: DBs) {
  const payouts = await dbs.biz.get('payouts', {
    reference: { $regex: transactionId }
  });
  if (payouts) {
    return payouts.at(-1);
  }
  return null;
}

async function getTransactionDetails(paymentId: string, dbs: DBs) {
  const payment = await dbs.biz.getOne('transactiondetails', { paymentId });
  return payment;
}
async function getVoucherDetails(transactionId: string, dbs: DBs) {
  const voucher = await dbs.ventogram.getOne('vouchers', { id: transactionId });
  return voucher;
}

async function getPaymentDetails(transactionId: string, dbs: DBs) {
  const paymentDetails: Partial<PaymentV2> | null | undefined = await dbs.biz.getOne('paymentv2', {
    reference: transactionId
  });
  if (paymentDetails) {
    return paymentDetails;
  }
  return null;
}

let detailsMap = {
  payout: async (transactionId: string) => {
    const payoutDetails: Payouts | null | undefined = await getPayoutDetails(transactionId, dbs);
    if (payoutDetails) {
      const { status, note, narration } = payoutDetails;
      return {
        narration,
        note,
        sessionId: status === 'completed' ? note : '',
        failureReason: status === 'failed' ? note : '',
        fromReference: transactionId
      };
    }
  },
  offramp: async (transactionId: string) => {
    const paymentDetails = await getPaymentDetails(transactionId, dbs);
    const transactiondetails = await getTransactionDetails(transactionId, dbs);
    let payoutDetails = {} as any;
    if (transactiondetails?.transferId)
      payoutDetails = await getPayoutDetails(transactiondetails.transferId, dbs);
    if (paymentDetails) {
      const { customerEmail, address, transactions, reference } = paymentDetails;
      const hash = transactions ? Object.keys(transactions)[0] : '';
      return {
        fromReference: reference,
        email: customerEmail,
        receiverWallet: address,
        transactionHash: hash,
        sessionId: payoutDetails.note,
        failureReason: payoutDetails.status === 'failed' ? payoutDetails.note : ''
      };
    }
    return {};
  },
  voucher: async (transactionId: string) => {
    const voucherDetails: Partial<VentogramVoucherSchema> | null = await getVoucherDetails(
      transactionId,
      dbs
    );
    if (voucherDetails) {
      const { email, bankName, bankCode, accountNumber, accountName, code } = voucherDetails;
      return {
        receiverBank: `${bankCode}::${bankName}::${accountNumber}::${accountName}`,
        email: email,
        voucherCode: code || ''
      };
    }
    return {};
  },
  withdrawal: async (transactionId: string) => {
    return {};
  },
  transfer: async (transactionId: string) => {
    return { fromReference: transactionId };
  },
  onramp: async (transactionId: string) => {
    const voucherDetails: Partial<VentogramVoucherSchema> | null = await getVoucherDetails(
      transactionId,
      dbs
    );
    if (voucherDetails) {
      const { email, bankName, bankCode, accountNumber, accountName, code } = voucherDetails;
      return {
        receiverBank: `${bankCode}::${bankName}::${accountNumber}::${accountName}`,
        email: email,
        voucherCode: code || ''
      };
    }
    return {};
  },
  conversion: async (transactionId: string) => {
    return { fromReference: transactionId };
  },
  deposit: async (transactionId: string) => {
    return {};
  },
  refund: async (transactionId: string) => {
    return { fromReference: transactionId };
  }
};

const getVentogramBalances = async (username: string) => {
  return dbs.ventogram.get('merchantbalances', { merchant: username! });
};

const getBizBalances = async (username: string) => {
  return dbs.biz.get('balancev2', { username });
};

const getWaasBalances = async (username: string) => {
  return dbs.waas.get('addresss', { reference: username });
};

const getMerchantBalances = async (username: string) => {
  const ventogramBalances = await getVentogramBalances(username);
  const bizBalances = await getBizBalances(username);
  const waasBalances = await getWaasBalances(username);
  const formedBalances = formBalances(bizBalances).concat(formWaasBalances(waasBalances));
  return {
    payout: formedBalances,
    collection: formBalances(ventogramBalances, [
      { currency: 'NGN', amount: 0 },
      { currency: 'USD', amount: 0 }
    ])
  };
};

export {
  watchDb,
  countDocumentsInCollection,
  writeMissingMeiliRecords,
  detailsMap,
  getMerchantBalances
};
