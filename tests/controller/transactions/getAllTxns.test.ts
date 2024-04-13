import { describe, expect, test, jest, beforeEach } from 'bun:test';
import { MongoError } from 'mongodb';

import { dbs as mockDB } from '../../../src/db';
import { getAllTxns } from '../../../src/controllers/transactions/getAllTxns';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';

describe('Testing Get All Transactions Controller', () => {
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

  test('should return paginated transactions', async () => {
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
    const response = await getAllTxns(ctx, {
      query: {
        perPage: 2,
        page: 5
      }
    });
    expect(response).toEqual({
      message: 'Get transactions success',
      success: true,
      data: {
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
      }
    });
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      ['transactiondetails', {}, 2, 8, false, [], { query: '' }]
    ]);
  });

  test('search should be true and search fields should exist if query exists', async () => {
    const mongoError = new MongoError('connection error');
    const paginatedGetMock = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.paginatedGet = paginatedGetMock;
    await getAllTxns(ctx, { query: { perPage: 20, page: 2, query: 'query' } });
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(1);
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      [
        'transactiondetails',
        {},
        20,
        20,
        true,
        ['transactionId', 'sender', 'username', 'transferId'],
        { query: 'query' }
      ]
    ]);
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    const paginatedGetMock = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.paginatedGet = paginatedGetMock;
    const response = await getAllTxns(ctx, { query: { perPage: 20, page: 2 } });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.paginatedGet).toHaveBeenCalledTimes(1);
    expect((mockDB.biz.paginatedGet as any).mock.calls).toEqual([
      ['transactiondetails', {}, 20, 20, false, [], { query: '' }]
    ]);
  });
});
