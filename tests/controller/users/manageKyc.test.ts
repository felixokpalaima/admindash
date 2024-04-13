import { describe, expect, test, jest, beforeEach } from 'bun:test';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { bendGateway } from '../../../src/gateways/bend';
import { manageKyc } from '../../../src/controllers/users/manageKyc';

describe("Testing managing user's kyc", () => {
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

  test("should successfully downgrade user's kyc", async () => {
    const mockRequestToDowngradeKyc = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: true
      }
    });
    bendGateway.makeRequest = mockRequestToDowngradeKyc;
    const response = await manageKyc(ctx, {
      body: { username: 'chang', kycLevel: 1 },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockRequestToDowngradeKyc).toHaveBeenCalledTimes(1);
    expect(mockRequestToDowngradeKyc.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/kyc/updatekyclevel',
          payload: { username: 'chang', level: 1 },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });

  test('should not be able to downgrade/upgrade kyc', async () => {
    const mockRequestToDowngradeKyc = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        success: false
      }
    });
    bendGateway.makeRequest = mockRequestToDowngradeKyc;
    const response = await manageKyc(ctx, {
      body: { username: 'chang', kycLevel: 2 },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(false);
    expect(mockRequestToDowngradeKyc).toHaveBeenCalledTimes(1);
    expect(mockRequestToDowngradeKyc.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/kyc/updatekyclevel',
          payload: { username: 'chang', level: 2 },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });

  test('should jump to catch block', async () => {
    const mockRequestToDowngradeKyc = jest.fn().mockRejectedValue(undefined);
    bendGateway.makeRequest = mockRequestToDowngradeKyc;
    const response = await manageKyc(ctx, {
      body: { username: 'chang', kycLevel: 3 },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToDowngradeKyc).toHaveBeenCalledTimes(1);
    expect(mockRequestToDowngradeKyc.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/kyc/updatekyclevel',
          payload: { username: 'chang', level: 3 },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });
});
