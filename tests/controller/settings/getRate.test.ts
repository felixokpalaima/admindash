import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { getRate } from '../../../src/controllers/settings/getRates';
import { bizGateway } from '../../../src/gateways/biz';

describe('Testing get Rate', () => {
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

  test('Should successfully get rate', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {}
      }
    });

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getRate(ctx, {});

    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/admin-rate',
          timeout: 10000
        }
      ]
    ]);
  });

  test('Should not be able get rate', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue({
      data: {
        success: true
      }
    });

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getRate(ctx, {});

    expect(response.statusCode).toBe(400);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Could not get rate');
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/admin-rate',
          timeout: 10000
        }
      ]
    ]);
  });

  test('Should jump to catch block', async () => {
    const mockRequestToGetRate = jest.fn().mockResolvedValue(new Error());

    bizGateway.makeRequest = mockRequestToGetRate;
    const response = await getRate(ctx, {});

    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Get rate request errored');
    expect(mockRequestToGetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToGetRate.mock.calls).toEqual([
      [
        {
          method: 'GET',
          path: '/v2/currency/admin-rate',
          timeout: 10000
        }
      ]
    ]);
  });
});
