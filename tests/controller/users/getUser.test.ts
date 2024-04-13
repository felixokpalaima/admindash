import { describe, expect, test, jest, beforeEach, spyOn } from 'bun:test';
import { getUser } from '../../../src/controllers/users/getUser';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { MongoError } from 'mongodb';

describe('Testing User Controllers', () => {
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

  test('should return not found', async () => {
    const getOneMock = jest.fn().mockResolvedValue(null);
    mockDB.biz.getOne = getOneMock;
    mockDB.biz.get = jest.fn().mockResolvedValue({});
    const response = await getUser(ctx, { body: { username: 'randomname' } });
    expect(response).toEqual({
      message: `User [randomname] not found`,
      statusCode: 404,
      success: false
    });
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.get).toHaveBeenCalledTimes(0);
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['usersV2', { username: 'randomname' }]
    ]);
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    mongoError.code = 11000;
    const getOneMock = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.getOne = getOneMock;
    mockDB.biz.get = jest.fn().mockResolvedValue({});
    const response = await getUser(ctx, { body: { username: 'randomname' } });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.get).toHaveBeenCalledTimes(0);
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['usersV2', { username: 'randomname' }]
    ]);
  });

  test('should return userData', async () => {
    const getOneMock = jest.fn().mockResolvedValue({
      username: 'username',
      fullname: 'fullname',
      phone: 'phone',
      countryCode: 'countryCode',
      email: 'email',
      mfa: {
        enrolled: true
      },
      createdAt: 'createdAt'
    });
    mockDB.biz.getOne = getOneMock;
    mockDB.biz.get = jest
      .fn()
      .mockReturnValueOnce([
        {
          canWithdraw: true,
          currency: 'NGN',
          amount: 100
        }
      ])
      .mockReturnValueOnce([
        {
          username: 'username',
          verificationMerchant: 'mono',
          recordId: '123456789',
          kycLevel: 1
        }
      ]);

    const infoSpy = spyOn(ctx.log, 'info');
    const response = await getUser(ctx, { body: { username: 'username' } });

    expect(infoSpy).toHaveBeenCalledTimes(3);
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.get).toHaveBeenCalledTimes(2);
    console.log(response.data?.balances);
    expect(response.data).toEqual({
      fullName: 'fullname',
      username: 'username',
      phone: 'phone',
      countryCode: 'countryCode',
      email: 'email',
      mfaEnrolled: true,
      accountCreated: 'createdAt',
      kycStatus: 1,
      bvn: '123456789',
      withdrawalEnabled: true,
      balances: [
        {
          currency: 'NGN',
          amount: 100,
          canWithdraw: true
        }
      ]
    });
  });
});
