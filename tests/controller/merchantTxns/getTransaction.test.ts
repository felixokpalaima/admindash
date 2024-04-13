import { describe, expect, test, jest, beforeEach, spyOn, mock } from 'bun:test';
import { getOne } from '../../../src/controllers/merchants/transactions/getTransaction';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDb } from '../../../src/db';
import helpers from '../../../src/utils/helpers';

describe('Testing Get Merchant Txn Controllers', () => {
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

  test('should get single transactions successfully', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        getDocById: async () => {
          return {
            id: '65042ecc85f611232e883e24',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'USD',
            transactionId: '410a2e96153b45a7b863602195e1028a',
            fromAccount: 'account',
            isFromRegUser: true,
            toPrevBalance: 14696.9,
            fromPrevBalance: 44.13,
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
          };
        }
      };
    });

    let managers = await import('../../../src/db/meiliSearch/managers');
    const getDocSpy = spyOn(managers, 'getDocById');

    const mockReq = {
      query: { id: '65042ecc85f611232e883e24' },
      store: {
        userDetails: {
          user: {
            username: 'account'
          }
        }
      }
    };

    const result = await getOne(ctx, mockReq);

    expect(result).toEqual({
      message: 'successful',
      success: true,
      data: helpers.renameTransactionFields(
        {
          id: '65042ecc85f611232e883e24',
          version: 'v1.0',
          source: 'biz/transactiondetails',
          toCurrency: 'USD',
          transactionId: '410a2e96153b45a7b863602195e1028a',
          fromAccount: 'account',
          isFromRegUser: true,
          toPrevBalance: 14696.9,
          fromPrevBalance: 44.13,
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
          transferId: 'e0beaede2ee647688f99fb44f5da3c4f__account',
          fromReference: '410a2e96153b45a7b863602195e1028a'
        },
        'account'
      ),
      statusCode: 200
    });

    expect(getDocSpy).toHaveBeenCalledTimes(1);
  });

  test('should return error when txn does not belong to merchant', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        getDocById: async () => {
          return {
            id: '65042ecc85f611232e883e24',
            version: 'v1.0',
            source: 'biz/transactiondetails',
            toCurrency: 'USD',
            transactionId: '410a2e96153b45a7b863602195e1028a',
            fromAccount: 'account',
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
          };
        }
      };
    });
    let managers = await import('../../../src/db/meiliSearch/managers');
    const getDocSpy = spyOn(managers, 'getDocById');

    const mockReq = {
      query: { transactionId: '65042ecc85f611232e883e24' },
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      }
    };

    const result = await getOne(ctx, mockReq);

    expect(result).toEqual({
      message: 'could not get document',
      success: false,
      statusCode: 500
    });

    expect(getDocSpy).toHaveBeenCalledTimes(1);
  });

  test('should jump to catch block', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        getDocById: async () => {
          throw new Error();
        }
      };
    });
    let managers = await import('../../../src/db/meiliSearch/managers');
    const getDocSpy = spyOn(managers, 'getDocById');

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

    const result = await getOne(ctx, mockReq);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      message: 'could not get document'
    });

    expect(getDocSpy).toHaveBeenCalledTimes(1);
  });
});
