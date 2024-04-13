import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { retryTransaction } from '../../../src/controllers/transactions/retryTransaction';
import { remitGateway } from '../../../src/gateways/remit';

describe('Testing retry transaction', () => {
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

  test('Should successfully retry transaction', async () => {
    const mockRequestToRetryTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: true
      }
    });
    remitGateway.makeRequest = mockRequestToRetryTransaction;
    const response = await retryTransaction(ctx, {
      body: {
        id: 'id',
        service: 'lenco',
        accountNumber: '00',
        account: '',
        bankCode: '054',
        bankName: 'gtbank'
      }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToRetryTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRetryTransaction.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/api/v1/payout/manual-retry',
          timeout: 10000,
          payload: {
            id: 'id',
            service: 'lenco',
            accountNumber: '00',
            account: '',
            bankCode: '054',
            bankName: 'gtbank'
          }
        }
      ]
    ]);
  });

  test('Should not be able to retry transaction', async () => {
    const mockRequestToRetryTransaction = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: false
      }
    });
    remitGateway.makeRequest = mockRequestToRetryTransaction;
    const response = await retryTransaction(ctx, {
      body: {
        id: 'id',
        service: 'lenco',
        accountNumber: '00',
        account: '',
        bankCode: '054',
        bankName: 'gtbank'
      }
    });
    expect(response.success).toBe(false);
    expect(mockRequestToRetryTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRetryTransaction.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/api/v1/payout/manual-retry',
          timeout: 10000,
          payload: {
            id: 'id',
            service: 'lenco',
            accountNumber: '00',
            account: '',
            bankCode: '054',
            bankName: 'gtbank'
          }
        }
      ]
    ]);
  });

  test('should jump to catch block', async () => {
    const mockRequestToRetryTransaction = jest.fn().mockRejectedValue(undefined);
    remitGateway.makeRequest = mockRequestToRetryTransaction;
    const response = await retryTransaction(ctx, {
      body: {
        id: 'id',
        service: 'lenco',
        accountNumber: '00',
        account: '',
        bankCode: '054',
        bankName: 'gtbank'
      }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToRetryTransaction).toHaveBeenCalledTimes(1);
    expect(mockRequestToRetryTransaction.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/api/v1/payout/manual-retry',
          timeout: 10000,
          payload: {
            id: 'id',
            service: 'lenco',
            accountNumber: '00',
            account: '',
            bankCode: '054',
            bankName: 'gtbank'
          }
        }
      ]
    ]);
  });
});
