import { describe, expect, test, jest, beforeEach, spyOn, mock } from 'bun:test';
import { getAll } from '../../../src/controllers/merchants/transactions/getTransactions';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDb } from '../../../src/db';

describe('Testing Get Merchant Txns Controllers', () => {
  let ctx: RequestContext;
  beforeEach(async () => {
    jest.restoreAllMocks();
    let envConfigs = getConfig();
    ctx = {
      config: envConfigs,
      dbs: mockDb,
      log: getLogger(''),
      getLogger
    };
  });

  test('should get all merchant transactions successfully', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        searchDocs: async () => {
          return {
            hits: [
              {
                id: '655deadd0575acaa521847b3',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'NGN',
                transactionId: '1815655961de49278ea5bcc135fa8f1f',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 32148,
                transactionType: 'transfer',
                status: 'completed',
                businessId: 'coinprofileremittance',
                date: '2023-11-22T11:49:49.888Z',
                fromCurrency: 'NGN',
                fromAmount: 10,
                toAmount: 10,
                toAccount: 'payments',
                createdAt: '2023-11-22T11:49:49.930Z',
                updatedAt: '2023-11-22T11:49:49.930Z',
                externalNote: 'fraud',
                transferId: '9ac9e4417c524363af34613cbd72f0ff__account'
              },
              {
                id: '655dea580575ac4cc11847a9',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'NGN',
                transactionId: 'c0fa8369c97b4899a469358bd0913669',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 32138,
                transactionType: 'transfer',
                status: 'completed',
                businessId: 'coinprofileremittance',
                date: '2023-11-22T11:47:36.223Z',
                fromCurrency: 'NGN',
                fromAmount: 10,
                toAmount: 10,
                toAccount: 'payments',
                createdAt: '2023-11-22T11:47:36.290Z',
                updatedAt: '2023-11-22T11:47:36.290Z',
                externalNote: 'fraud',
                transferId: 'e2d9076225a04b0f9d719dab878cb58e__account'
              },
              {
                id: '65042ecc85f611232e883e24',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'USD',
                transactionId: '410a2e96153b45a7b863602195e1028a',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 14696.9,
                transactionType: 'transfer',
                status: 'processing',
                businessId: 'coinprofileremittance',
                date: '2023-09-15T10:15:39.959Z',
                fromCurrency: 'USD',
                fromAmount: 6,
                toAmount: 6,
                toAccount: 'cards',
                createdAt: '2023-09-15T10:15:40.023Z',
                updatedAt: '2023-09-15T10:15:40.023Z',
                externalNote: 'Card funding',
                transferId: 'e0beaede2ee647688f99fb44f5da3c4f__account'
              }
            ],
            totalPages: 10
          };
        }
      };
    });
    let managers = await import('../../../src/db/meiliSearch/managers');
    const getDocsSpy = spyOn(managers, 'searchDocs');

    const mockReq = {
      query: { query: 'random', perPage: 3, page: 1 },
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      }
    };

    const result = await getAll(ctx, mockReq);

    expect(result).toEqual({
      message: 'successful',
      success: true,
      data: {
        results: [
          {
            id: '655deadd0575acaa521847b3',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'NGN',
            transactionId: '1815655961de49278ea5bcc135fa8f1f',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 32148,
            transactionType: 'transfer',
            status: 'completed',
            businessId: 'coinprofileremittance',
            date: '2023-11-22T11:49:49.888Z',
            fromCurrency: 'NGN',
            fromAmount: '10.00',
            toAmount: '10.00',
            toAccount: 'payments',
            createdAt: '2023-11-22T11:49:49.930Z',
            updatedAt: '2023-11-22T11:49:49.930Z',
            externalNote: 'fraud',
            transferId: '9ac9e4417c524363af34613cbd72f0ff__account'
          },
          {
            id: '655dea580575ac4cc11847a9',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'NGN',
            transactionId: 'c0fa8369c97b4899a469358bd0913669',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 32138,
            transactionType: 'transfer',
            status: 'completed',
            businessId: 'coinprofileremittance',
            date: '2023-11-22T11:47:36.223Z',
            fromCurrency: 'NGN',
            fromAmount: '10.00',
            toAmount: '10.00',
            toAccount: 'payments',
            createdAt: '2023-11-22T11:47:36.290Z',
            updatedAt: '2023-11-22T11:47:36.290Z',
            externalNote: 'fraud',
            transferId: 'e2d9076225a04b0f9d719dab878cb58e__account'
          },
          {
            id: '65042ecc85f611232e883e24',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'USD',
            transactionId: '410a2e96153b45a7b863602195e1028a',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 14696.9,
            transactionType: 'transfer',
            status: 'processing',
            businessId: 'coinprofileremittance',
            date: '2023-09-15T10:15:39.959Z',
            fromCurrency: 'USD',
            fromAmount: '6.00',
            toAmount: '6.00',
            toAccount: 'cards',
            createdAt: '2023-09-15T10:15:40.023Z',
            updatedAt: '2023-09-15T10:15:40.023Z',
            externalNote: 'Card funding',
            transferId: 'e0beaede2ee647688f99fb44f5da3c4f__account'
          }
        ],
        total: 10,
        page: 1,
        perPage: 3
      },
      statusCode: 200
    });

    expect(getDocsSpy).toHaveBeenCalledTimes(1);
  });

  test('should filter merchant transactions successfully', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        searchDocs: async () => {
          return {
            hits: [
              {
                id: '655deadd0575acaa521847b3',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'NGN',
                transactionId: '1815655961de49278ea5bcc135fa8f1f',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 32148,
                transactionType: 'transfer',
                status: 'completed',
                businessId: 'coinprofileremittance',
                date: '2023-11-22T11:49:49.888Z',
                fromCurrency: 'NGN',
                fromAmount: '10.00',
                toAmount: '10.00',
                toAccount: 'payments',
                createdAt: '2023-11-22T11:49:49.930Z',
                updatedAt: '2023-11-22T11:49:49.930Z',
                externalNote: 'fraud',
                transferId: '9ac9e4417c524363af34613cbd72f0ff__account'
              },
              {
                id: '655dea580575ac4cc11847a9',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'NGN',
                transactionId: 'c0fa8369c97b4899a469358bd0913669',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 32138,
                transactionType: 'transfer',
                status: 'completed',
                businessId: 'coinprofileremittance',
                date: '2023-11-22T11:47:36.223Z',
                fromCurrency: 'NGN',
                fromAmount: '10.00',
                toAmount: '10.00',
                toAccount: 'payments',
                createdAt: '2023-11-22T11:47:36.290Z',
                updatedAt: '2023-11-22T11:47:36.290Z',
                externalNote: 'fraud',
                transferId: 'e2d9076225a04b0f9d719dab878cb58e__account'
              },
              {
                id: '65042ecc85f611232e883e24',
                version: 'v1.0',
                source: 'biz/transactiondetails',
                toCurrency: 'USD',
                transactionId: '410a2e96153b45a7b863602195e1028a',
                fromAccount: 'random',
                isFromRegUser: true,
                toPrevBalance: 14696.9,
                transactionType: 'transfer',
                status: 'processing',
                businessId: 'coinprofileremittance',
                date: '2023-09-15T10:15:39.959Z',
                fromCurrency: 'USD',
                fromAmount: '6.00',
                toAmount: '6.00',
                toAccount: 'cards',
                createdAt: '2023-09-15T10:15:40.023Z',
                updatedAt: '2023-09-15T10:15:40.023Z',
                externalNote: 'Card funding',
                transferId: 'e0beaede2ee647688f99fb44f5da3c4f__account'
              }
            ],
            totalPages: 1
          };
        }
      };
    });
    let managers = await import('../../../src/db/meiliSearch/managers');
    const searchDocsSpy = spyOn(managers, 'searchDocs');

    const mockReq = {
      query: {},
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      },
      filters: {
        transactionType: 'transfer'
      }
    };

    const result = await getAll(ctx, mockReq);

    expect(result).toEqual({
      message: 'successful',
      success: true,
      data: {
        results: [
          {
            id: '655deadd0575acaa521847b3',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'NGN',
            transactionId: '1815655961de49278ea5bcc135fa8f1f',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 32148,
            transactionType: 'transfer',
            status: 'completed',
            businessId: 'coinprofileremittance',
            date: '2023-11-22T11:49:49.888Z',
            fromCurrency: 'NGN',
            fromAmount: '10.00',
            toAmount: '10.00',
            toAccount: 'payments',
            createdAt: '2023-11-22T11:49:49.930Z',
            updatedAt: '2023-11-22T11:49:49.930Z',
            externalNote: 'fraud',
            transferId: '9ac9e4417c524363af34613cbd72f0ff__account'
          },
          {
            id: '655dea580575ac4cc11847a9',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'NGN',
            transactionId: 'c0fa8369c97b4899a469358bd0913669',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 32138,
            transactionType: 'transfer',
            status: 'completed',
            businessId: 'coinprofileremittance',
            date: '2023-11-22T11:47:36.223Z',
            fromCurrency: 'NGN',
            fromAmount: '10.00',
            toAmount: '10.00',
            toAccount: 'payments',
            createdAt: '2023-11-22T11:47:36.290Z',
            updatedAt: '2023-11-22T11:47:36.290Z',
            externalNote: 'fraud',
            transferId: 'e2d9076225a04b0f9d719dab878cb58e__account'
          },
          {
            id: '65042ecc85f611232e883e24',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'USD',
            transactionId: '410a2e96153b45a7b863602195e1028a',
            fromAccount: 'random',
            isFromRegUser: true,
            toPrevBalance: 14696.9,
            transactionType: 'transfer',
            status: 'processing',
            businessId: 'coinprofileremittance',
            date: '2023-09-15T10:15:39.959Z',
            fromCurrency: 'USD',
            fromAmount: '6.00',
            toAmount: '6.00',
            toAccount: 'cards',
            createdAt: '2023-09-15T10:15:40.023Z',
            updatedAt: '2023-09-15T10:15:40.023Z',
            externalNote: 'Card funding',
            transferId: 'e0beaede2ee647688f99fb44f5da3c4f__account'
          }
        ],
        total: 1,
        page: 1,
        perPage: 50
      },
      statusCode: 200
    });

    expect(searchDocsSpy).toHaveBeenCalledTimes(1);
  });

  test('should jump to catch block', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        searchDocs: async () => {
          throw new Error('error occured');
        }
      };
    });
    let managers = await import('../../../src/db/meiliSearch/managers');
    const getDocsSpy = spyOn(managers, 'searchDocs');

    const mockReq = {
      query: {},
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      }
    };

    const result = await getAll(ctx, mockReq);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      message: 'error occured'
    });

    expect(getDocsSpy).toHaveBeenCalledTimes(1);
  });
});
