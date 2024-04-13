import { describe, expect, test, jest, beforeEach, mock, spyOn } from 'bun:test';
import { getBalances } from '../../../src/controllers/merchants/balances/getBalances';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDb } from '../../../src/db';

describe('Testing Get Merchant Balances Controller', () => {
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

  test('should retrieve merchant balances successfully', async () => {
    const mockUser = {
      username: 'username'
    };
    const mockReq = {
      store: {
        userDetails: {
          user: mockUser
        }
      }
    };

    mock.module('../../../src/db/utils', () => {
      return {
        getMerchantBalances: async () => {
          return {
            payout: [
              { currency: 'NGN', amount: 0 },
              { currency: 'USD', amount: 0 }
            ],
            collection: [
              { currency: 'NGN', amount: 0 },
              { currency: 'USD', amount: 0 }
            ]
          };
        }
      };
    });

    let utils = await import('../../../src/db/utils');
    const getBalanceSpy = spyOn(utils, 'getMerchantBalances');

    const result = await getBalances(ctx, mockReq);
    expect(result).toEqual({
      success: true,
      message: `successful`,
      statusCode: 200,
      data: {
        payout: [
          { currency: 'NGN', amount: 0 },
          { currency: 'USD', amount: 0 }
        ],
        collection: [
          { currency: 'NGN', amount: 0 },
          { currency: 'USD', amount: 0 }
        ]
      }
    });
    expect(getBalanceSpy).toHaveBeenCalledTimes(1);
  });

  test('should jump to catch block', async () => {
    mock.module('../../../src/db/utils', () => {
      return {
        getMerchantBalances: async () => {
          throw new Error();
        }
      };
    });
    let managers = await import('../../../src/db/utils');
    const getBalanceSpy = spyOn(managers, 'getMerchantBalances');

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

    const result = await getBalances(ctx, mockReq);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      message: 'could not get balances'
    });

    expect(getBalanceSpy).toHaveBeenCalledTimes(1);
  });
});
