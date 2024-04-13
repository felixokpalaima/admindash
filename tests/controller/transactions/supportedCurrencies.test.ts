import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { getSupportedCurrencies } from '../../../src/controllers/transactions/supportedCurrencies';
import { bizGateway } from '../../../src/gateways/biz';

describe('Testing get supported currencies', () => {
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

  test('Should successfully get supported currencies', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          incomingCurrencies: ['BTC', 'ETH', 'USDT', 'TRON_USDT', 'DASH', 'CUSD', 'BUSD'],
          outgoingCurrencies: ['NGN', 'USD']
        }
      }
    });

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getSupportedCurrencies(ctx, {});

    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/supported',
          timeout: 10000
        }
      ]
    ]);
  });

  test('Should not be able get supported currencies', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue({
      data: {
        success: true
      }
    });

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getSupportedCurrencies(ctx, {});

    expect(response.statusCode).toBe(400);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Could not get supported currencies');
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/supported',
          timeout: 10000
        }
      ]
    ]);
  });

  test('Should jump to catch block', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue(new Error());

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getSupportedCurrencies(ctx, {});

    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Get supported currencies request errored');
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/supported',
          timeout: 10000
        }
      ]
    ]);
  });
});
