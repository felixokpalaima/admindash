import { describe, expect, test, jest, beforeEach } from 'bun:test';
import { MongoError } from 'mongodb';

import { dbs as mockDB } from '../../../src/db';
import { filterTxns } from '../../../src/controllers/transactions/filterTxns';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';

describe('Testing Filter Transactions Controller', () => {
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

  test('should return bad request if filter is not provided', async () => {
    const response = await filterTxns(ctx, {
      query: {
        perPage: 20,
        page: 1
      }
    });
    expect(response).toEqual({
      message: `Provide fields to filter transactions by`,
      statusCode: 400,
      success: false
    });
  });

  test('should return not found if username does not exist on db', async () => {
    const getOneMock = jest.fn().mockResolvedValue(null);
    mockDB.biz.getOne = getOneMock;
    const response = await filterTxns(ctx, {
      query: {
        username: 'randomUser',
        perPage: 20,
        page: 1
      }
    });
    expect(response).toEqual({
      message: `User [randomUser] not found`,
      statusCode: 404,
      success: false
    });
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['usersV2', { username: 'randomUser' }]
    ]);
  });

  test('should return filtered paginated transactions', async () => {
    const getOneMock = jest.fn().mockResolvedValue({
      username: 'another',
      email: 'foo@example.com'
    });
    mockDB.biz.getOne = getOneMock;
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
      total: 50
    });

    mockDB.biz.paginatedGet = paginatedGetMock;

    const response = await filterTxns(ctx, {
      query: {
        username: 'another',
        currency: 'USD',
        status: 'fullfiled',
        type: 'internalTransfer',
        perPage: 2,
        page: 5
      }
    });

    expect(response.message).toEqual('Transactions received successfully');
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
        total: 50,
        perPage: 2,
        pages: 25
      }
    });

    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      [
        'transactiondetails',
        { username: 'another', currency: 'USD', status: 'fullfiled', type: 'internalTransfer' },
        2,
        8
      ]
    ]);
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    mockDB.biz.getOne = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.paginatedGet = jest.fn().mockResolvedValue({});
    const response = await filterTxns(ctx, { query: { username: 'user', perPage: 20, page: 2 } });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(0);
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([['usersV2', { username: 'user' }]]);
  });
});
