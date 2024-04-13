import { describe, expect, test, jest, beforeEach, spyOn } from 'bun:test';
import { MongoError } from 'mongodb';

import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { getTxn } from '../../../src/controllers/transactions/getTxn';

describe('Testing Get Transaction Controller', () => {
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
    mockDB.biz.getOne = jest.fn().mockResolvedValue(null);
    const infoSpy = spyOn(ctx.log, 'info');
    const response = await getTxn(ctx, { query: { transactionId: '1234567890' } });
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      message: `Transaction with id - [1234567890] not found`,
      statusCode: 404,
      success: false
    });
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['transactiondetails', { transactionId: '1234567890' }]
    ]);
  });

  test('should jump to catch block', async () => {
    const mongoError = new MongoError('connection error');
    const getOneMock = jest.fn().mockRejectedValue(mongoError);
    mockDB.biz.getOne = getOneMock;
    const response = await getTxn(ctx, { query: { transactionId: '1234567890' } });
    expect(response).toEqual({
      message: 'connection error',
      success: false,
      statusCode: 500
    });
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['transactiondetails', { transactionId: '1234567890' }]
    ]);
  });

  test('should return transaction', async () => {
    const getOneMock = jest.fn().mockResolvedValue({
      currency: 'NGN',
      version: 'v1.2',
      internalMemo: 'NGN balance funding',
      isFromRegUser: true,
      sender: 'ventogram',
      username: 'username',
      paymentId: '9paymentId',
      amount: 500,
      fromCurrency: 'NGN',
      fromAmount: 500,
      type: 'deposit',
      date: 'date',
      transactionId: '1234567890',
      businessId: 'businessId',
      status: 'fullfiled',
      prevBalance: 0
    });
    mockDB.biz.getOne = getOneMock;

    const infoSpy = spyOn(ctx.log, 'info');
    const response = await getTxn(ctx, { query: { transactionId: '1234567890' } });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(ctx.dbs.biz.getOne).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      success: true,
      message: 'Transaction with id [1234567890] retrieved successfully',
      data: {
        currency: 'NGN',
        version: 'v1.2',
        internalMemo: 'NGN balance funding',
        isFromRegUser: true,
        sender: 'ventogram',
        username: 'username',
        paymentId: '9paymentId',
        amount: 500,
        fromCurrency: 'NGN',
        fromAmount: 500,
        type: 'deposit',
        date: 'date',
        transactionId: '1234567890',
        businessId: 'businessId',
        status: 'fullfiled',
        prevBalance: 0
      }
    });
    expect((mockDB.biz.getOne as any).mock.calls).toEqual([
      ['transactiondetails', { transactionId: '1234567890' }]
    ]);
  });
});
