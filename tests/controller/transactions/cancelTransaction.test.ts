import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { cancelTransaction } from '../../../src/controllers/transactions/cancelTransaction';
import { remitGateway } from '../../../src/gateways/remit';

describe('Testing cancel transaction', () => {
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

  test('Should successfully cancel transaction', async () => {
    const mockRequestToCancelTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: true
      }
    });
    remitGateway.makeRequest = mockRequestToCancelTransaction;
    const response = await cancelTransaction(ctx, { body: { transactionId: '0xe' } });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToCancelTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToCancelTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/api/v1/payout/cancel?id=0xe', timeout: 10000 }]
    ]);
  });

  test('Should not be able to cancel transaction', async () => {
    const mockRequestToCancelTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: false
      }
    });
    remitGateway.makeRequest = mockRequestToCancelTransaction;
    const response = await cancelTransaction(ctx, { body: { transactionId: '0xe' } });
    expect(response.success).toBe(false);
    expect(mockRequestToCancelTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToCancelTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/api/v1/payout/cancel?id=0xe', timeout: 10000 }]
    ]);
  });

  test('should jump to catch block', async () => {
    const mockRequestToCancelTransaction = jest.fn().mockRejectedValue(undefined);
    remitGateway.makeRequest = mockRequestToCancelTransaction;
    const response = await cancelTransaction(ctx, {
      body: { transactionId: '0xe', businessId: 'metamask' }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToCancelTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToCancelTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/api/v1/payout/cancel?id=0xe', timeout: 10000 }]
    ]);
  });
});
