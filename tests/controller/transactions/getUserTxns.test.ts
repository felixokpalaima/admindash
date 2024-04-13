import { describe, expect, test, jest, beforeEach } from 'bun:test';
import { MongoError } from 'mongodb';

import { dbs as mockDB } from '../../../src/db';
import { getUserTxns } from '../../../src/controllers/transactions/getUserTxns';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';

describe('Testing Get User Transactions Controller', () => {
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

  test('should return bad request if email and username are not provided', async () => {
    const response = await getUserTxns(ctx, {
      query: {
        perPage: 20,
        page: 1
      }
    });
    expect(response).toEqual({
      message: `Provide email or username to fetch user transactions`,
      statusCode: 400,
      success: false
    });
  });

  test('should return not found if email address does not exist on db', async () => {
    const getOneMock = jest.fn().mockResolvedValue(null);
    mockDB.biz.getOne = getOneMock;
    const response = await getUserTxns(ctx, {
      query: {
        email: 'foo@bar.com',
        perPage: 20,
        page: 1
      }
    });
    expect(response).toEqual({
      message: `User with email - [foo@bar.com] not found`,
      statusCode: 404,
      success: false
    });
  });

  test('should return bad request if username and email do not match', async () => {
    const getOneMock = jest.fn().mockResolvedValue({
      username: 'randomUser',
      email: 'foo@bar.com'
    });
    mockDB.biz.getOne = getOneMock;
    const response = await getUserTxns(ctx, {
      query: {
        email: 'foo@bar.com',
        username: 'anotherUser',
        perPage: 20,
        page: 1
      }
    });
    expect(response).toEqual({
      message: `Username and email do not match`,
      statusCode: 400,
      success: false
    });
  });

  test('should return paginated user transactions', async () => {
    const paginatedGetMock = jest.fn().mockResolvedValue({
      data: [
        {
          currency: 'USD',
          transactionId: 'transactionId1',
          sender: 'randomUser',
          type: 'internalTransfer',
          status: 'fullfiled',
          amount: 1,
          username: 'another'
        },
        {
          currency: 'USD',
          transactionId: 'transactionId2',
          sender: 'randomUser',
          type: 'internalTransfer',
          status: 'fullfiled',
          amount: 1,
          username: 'another'
        }
      ],
      total: 5
    });
    mockDB.biz.paginatedGet = paginatedGetMock;
    const response = await getUserTxns(ctx, {
      query: {
        username: 'randomUser',
        perPage: 2,
        page: 1
      }
    });
    expect(response.message).toEqual('User [randomUser] transactions received successfully');
    expect(response.success).toEqual(true);
    expect(response.data).toEqual({
      transactions: [
        {
          currency: 'USD',
          transactionId: 'transactionId1',
          sender: 'randomUser',
          type: 'internalTransfer',
          status: 'fullfiled',
          amount: 1,
          username: 'another'
        },
        {
          currency: 'USD',
          transactionId: 'transactionId2',
          sender: 'randomUser',
          type: 'internalTransfer',
          status: 'fullfiled',
          amount: 1,
          username: 'another'
        }
      ],
      pages: {
        total: 5,
        perPage: 2,
        pages: 3
      }
    });
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      ['transactiondetails', { $or: [{ username: 'randomUser' }, { sender: 'randomUser' }] }, 2, 0]
    ]);
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    const paginatedGetMock = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.paginatedGet = paginatedGetMock;
    const response = await getUserTxns(ctx, {
      query: { username: 'anotherUser', perPage: 20, page: 2 }
    });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(1);
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      [
        'transactiondetails',
        { $or: [{ username: 'anotherUser' }, { sender: 'anotherUser' }] },
        20,
        20
      ]
    ]);
  });
});
