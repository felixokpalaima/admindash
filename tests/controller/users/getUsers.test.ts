import { describe, expect, test, jest, beforeEach } from 'bun:test';
import { getUsers } from '../../../src/controllers/users/getUsers';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { MongoError } from 'mongodb';

describe('Testing Get Users Controllers', () => {
  let ctx: RequestContext;
  beforeEach(async () => {
    jest.restoreAllMocks();
    let envConfigs = getConfig();
    ctx = {
      config: envConfigs,
      dbs: mockDB,
      log: getLogger(''),
      getLogger
    };
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    mockDB.biz.paginatedGet = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.get = jest.fn().mockResolvedValue({});
    const response = await getUsers(ctx, { query: { perPage: 20, page: 1, query: '' } });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.get).toHaveBeenCalledTimes(0);
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      ['usersV2', {}, 20, 0, false, [], { query: '' }]
    ]);
  });

  test('should return paginated usersData', async () => {
    const paginatedGetMock = jest.fn().mockResolvedValue({
      data: [
        {
          username: 'username',
          fullname: 'fullname',
          phone: 'phone',
          countryCode: 'countryCode',
          email: 'email',
          mfa: {
            enrolled: true
          },
          createdAt: 'createdAt'
        },
        {
          username: 'username2',
          fullname: 'fullname2',
          phone: 'phone2',
          countryCode: 'countryCode',
          email: 'email2',
          mfa: {
            enrolled: true
          },
          createdAt: 'createdAt'
        }
      ],
      total: 50
    });
    mockDB.biz.paginatedGet = paginatedGetMock;
    mockDB.biz.get = jest
      .fn()
      .mockReturnValueOnce([
        {
          currency: 'NGN',
          amount: 100,
          canWithdraw: true
        }
      ])
      .mockReturnValueOnce([
        {
          username: 'username',
          verificationMerchant: 'mono',
          recordId: '123456789',
          kycLevel: 3
        }
      ])
      .mockReturnValueOnce([
        {
          currency: 'USD',
          amount: 100,
          canWithdraw: true
        }
      ])
      .mockReturnValueOnce([
        {
          username: 'username2',
          kycLevel: 2
        }
      ]);

    const response = await getUsers(ctx, { query: { perPage: 20, page: 1 } });

    expect(response.data).toEqual({
      users: [
        {
          fullName: 'fullname',
          username: 'username',
          phone: 'phone',
          countryCode: 'countryCode',
          email: 'email',
          mfaEnrolled: true,
          accountCreated: 'createdAt',
          kycStatus: 3,
          bvn: '123456789',
          balances: [
            {
              currency: 'NGN',
              amount: 100,
              canWithdraw: true
            }
          ]
        },
        {
          fullName: 'fullname2',
          username: 'username2',
          phone: 'phone2',
          countryCode: 'countryCode',
          email: 'email2',
          mfaEnrolled: true,
          accountCreated: 'createdAt',
          kycStatus: 2,
          balances: [
            {
              currency: 'USD',
              amount: 100,
              canWithdraw: true
            }
          ]
        }
      ],
      pages: {
        total: 50,
        perPage: 20,
        pages: 3
      }
    });
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.get).toHaveBeenCalledTimes(4);
  });
});
