import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { disable2Fa } from '../../../src/controllers/users/disable2Fa';
import { bendGateway } from '../../../src/gateways/bend';

describe('Testing disabling 2FA', () => {
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

  test('should successfully disable 2FA', async () => {
    const mockRequestToDisableTwoFa = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: true
      }
    });
    bendGateway.makeRequest = mockRequestToDisableTwoFa;
    const response = await disable2Fa(ctx, {
      body: { username: 'chang' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToDisableTwoFa).toHaveBeenCalledTimes(1);
    expect(mockRequestToDisableTwoFa.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/user/admin-disable-two-step-verification',
          payload: { username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });

  test('should not be able to disable 2FA', async () => {
    const mockRequestToDisableTwoFa = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: false
      }
    });
    bendGateway.makeRequest = mockRequestToDisableTwoFa;
    const response = await disable2Fa(ctx, {
      body: { username: 'chang' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(false);
    expect(mockRequestToDisableTwoFa).toHaveBeenCalledTimes(1);
    expect(mockRequestToDisableTwoFa.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/user/admin-disable-two-step-verification',
          payload: { username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });

  test('should jump to catch block', async () => {
    const mockRequestToDisableTwoFa = jest.fn().mockRejectedValue(undefined);
    bendGateway.makeRequest = mockRequestToDisableTwoFa;
    const response = await disable2Fa(ctx, {
      body: { username: 'chang' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToDisableTwoFa).toHaveBeenCalledTimes(1);
    expect(mockRequestToDisableTwoFa.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/user/admin-disable-two-step-verification',
          payload: { username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });
});
