import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { setRate } from '../../../src/controllers/settings/setRates';
import { bizGateway } from '../../../src/gateways/biz';

describe('Testing set Rate', () => {
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

  test('Should successfully set rate', async () => {
    const mockRequestToSetRate = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: 'idToLoadRates'
        }
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            externalRateSub: 20,
            externalRateAdd: 10
          }
        }
      });

    bizGateway.makeRequest = mockRequestToSetRate;
    const response = await setRate(ctx, {
      body: {
        margin: 10,
        type: 'sell'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToSetRate).toHaveBeenCalledTimes(2);
    expect(mockRequestToSetRate.mock.calls).toEqual([
      [
        {
          method: 'PUT',
          path: '/v2/fees/sa16AST2UPHvtu8WoCN',
          payload: {
            externalRateAdd: 10
          },
          timeout: 10000
        }
      ],
      [
        {
          method: 'GET',
          path: '/v2/fees/load/XODArqmpFEtXgXlbZYZhJ7DCCmN?id=idToLoadRates',
          timeout: 10000
        }
      ]
    ]);
  });
  test('Should not be able set rate', async () => {
    const mockRequestToSetRate = jest.fn().mockResolvedValue({
      data: {
        success: false
      }
    });

    bizGateway.makeRequest = mockRequestToSetRate;
    const response = await setRate(ctx, {
      body: {
        margin: 10,
        type: 'sell'
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Could not set rate');
    expect(mockRequestToSetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToSetRate.mock.calls).toEqual([
      [
        {
          method: 'PUT',
          path: '/v2/fees/sa16AST2UPHvtu8WoCN',
          payload: {
            externalRateAdd: 10
          },
          timeout: 10000
        }
      ]
    ]);
  });
  test('Should jump to catch block', async () => {
    const mockRequestToSetRate = jest.fn().mockResolvedValue(new Error());

    bizGateway.makeRequest = mockRequestToSetRate;
    const response = await setRate(ctx, {
      body: {
        margin: 10,
        type: 'sell'
      }
    });

    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Set rate request errored');
    expect(mockRequestToSetRate).toHaveBeenCalledTimes(1);
    expect(mockRequestToSetRate.mock.calls).toEqual([
      [
        {
          method: 'PUT',
          path: '/v2/fees/sa16AST2UPHvtu8WoCN',
          payload: {
            externalRateAdd: 10
          },
          timeout: 10000
        }
      ]
    ]);
  });
});
