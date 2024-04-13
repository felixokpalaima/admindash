import { expect, test, jest, beforeEach, describe, Mock } from 'bun:test';
import { bizGateway } from '../../../src/gateways/biz';
import { enableAndDisableWithdrawals } from '../../../src/controllers/users/manageWithdrawal';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDB } from '../../../src/db';
import { AnyFunction } from 'bun';
import speak from 'speakeasy';

describe('Test canWithdraw Controller', () => {
  let ctx: RequestContext;
  beforeEach(() => {
    jest.restoreAllMocks();
    let envConfigs = getConfig();
    ctx = {
      config: envConfigs,
      dbs: mockDB,
      log: getLogger(''),
      getLogger
    };
  });
  test('should successfully enable user withdrawal', async () => {
    const mockRequestToCanWithdrawEndpoint: Mock<AnyFunction> = jest.fn().mockResolvedValue({
      data: {
        message: 'canWithdraw status is now enabled',
        success: true,
        status: 200,
        data: undefined
      }
    });

    const mockVerifiedOtp: Mock<AnyFunction> = jest.fn().mockResolvedValue(true);

    bizGateway.makeRequest = mockRequestToCanWithdrawEndpoint;
    speak.totp.verify = mockVerifiedOtp;

    const response = await enableAndDisableWithdrawals(ctx, {
      body: { username: 'chang', canWithdraw: true, totp: '123456' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
    expect(mockVerifiedOtp.mock.calls).toEqual([
      [
        {
          secret: getConfig().TOTP_SECRET,
          encoding: 'base32',
          token: '123456',
          window: 1
        }
      ]
    ]);
    expect(mockRequestToCanWithdrawEndpoint.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/balance/canwithdraw',
          payload: { canWithdraw: true, username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
    expect(bizGateway.makeRequest).toHaveBeenCalledTimes(1);
  });

  test('disabling user withdrawal should fail', async () => {
    const mockRequestToCanWithdrawEndpoint: Mock<AnyFunction> = jest.fn().mockResolvedValue({
      data: {
        message: 'Unable to change withdrawal status',
        success: false,
        status: 500,
        data: undefined
      }
    });
    const mockVerifiedOtp: Mock<AnyFunction> = jest.fn().mockResolvedValue(true);
    bizGateway.makeRequest = mockRequestToCanWithdrawEndpoint;
    speak.totp.verify = mockVerifiedOtp;
    const response = await enableAndDisableWithdrawals(ctx, {
      body: { username: 'chang', canWithdraw: false, totp: '123456' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockVerifiedOtp).toHaveBeenCalledTimes(1);
    expect(mockRequestToCanWithdrawEndpoint.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/balance/canwithdraw',
          payload: { canWithdraw: false, username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });

  test('should throw error', async () => {
    const mockRequestToCanWithdrawEndpoint: Mock<AnyFunction> = jest.fn().mockRejectedValue(null);
    const mockVerifiedOtp: Mock<AnyFunction> = jest.fn().mockResolvedValue(true);

    bizGateway.makeRequest = mockRequestToCanWithdrawEndpoint;
    speak.totp.verify = mockVerifiedOtp;
    const response = await enableAndDisableWithdrawals(ctx, {
      body: { username: 'chang', canWithdraw: false, totp: '123456' },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response.statusCode).toBe(500);
    expect(response.success).toBe(false);
    expect(mockRequestToCanWithdrawEndpoint.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/balance/canwithdraw',
          payload: { canWithdraw: false, username: 'chang' },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
  });
});
