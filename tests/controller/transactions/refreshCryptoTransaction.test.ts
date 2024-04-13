import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { bizGateway } from '../../../src/gateways/biz';
import { refreshCryptoTransaction } from '../../../src/controllers/transactions/refreshCryptoTransaction';

describe('Testing refresh crypto transaction', () => {
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
    const mockRequestToRefreshCryptoTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: true
      }
    });
    bizGateway.makeRequest = mockRequestToRefreshCryptoTransaction;
    const response = await refreshCryptoTransaction(ctx, {
      body: { transactionId: '0xe', businessId: 'metamask' }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToRefreshCryptoTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRefreshCryptoTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/v2/payment/refresh/0xe?businessId=metamask', timeout: 10000 }]
    ]);
  });

  test('Should not be able to refresh crypto transaction', async () => {
    const mockRequestToRefreshCryptoTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: false
      }
    });
    bizGateway.makeRequest = mockRequestToRefreshCryptoTransaction;
    const response = await refreshCryptoTransaction(ctx, {
      body: { transactionId: '0xe', businessId: 'metamask' }
    });
    expect(response.success).toBe(false);
    expect(mockRequestToRefreshCryptoTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRefreshCryptoTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/v2/payment/refresh/0xe?businessId=metamask', timeout: 10000 }]
    ]);
  });

  test('should jump to catch block', async () => {
    const mockRequestToRefreshCryptoTransaction = jest.fn().mockRejectedValue(undefined);
    bizGateway.makeRequest = mockRequestToRefreshCryptoTransaction;
    const response = await refreshCryptoTransaction(ctx, {
      body: { transactionId: '0xe', businessId: 'metamask' }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToRefreshCryptoTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRefreshCryptoTransaction.mock.calls).toEqual([
      [{ method: 'get', path: '/v2/payment/refresh/0xe?businessId=metamask', timeout: 10000 }]
    ]);
  });
});
