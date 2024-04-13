import { describe, expect, test, jest, beforeEach, spyOn } from 'bun:test';
import { defundUser } from '../../../src/controllers/users/defundUser';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { bizGateway as mockBizGateway } from '../../../src/gateways/biz';
import helpers from '../../../src/utils/helpers';

import { dbs as mockDB } from '../../../src/db';

describe('Testing Defund User Controllers', () => {
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

  test('should jump to catch block', async () => {
    const generateIdSpy = spyOn(helpers, 'generateId').mockReturnValue('randomId');

    const mockGateway = jest.fn().mockRejectedValue(new Error());
    mockBizGateway.makeRequest = mockGateway;

    const response = await defundUser(ctx, {
      body: {
        username: 'user',
        amount: 2,
        currency: 'USD',
        reason: 'reason'
      },
      store: { adminDetails: { token: 'token' } }
    });
    expect(response).toEqual({
      statusCode: 500,
      success: false,
      message: 'Unable to defund user'
    });

    expect(mockGateway.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/balance/user',
          payload: {
            memo: 'reason',
            currency: 'USD',
            amount: '2',
            receiverUsername: 'payments',
            transferId: 'randomId',
            senderUsername: 'user'
          },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
    expect(generateIdSpy).toHaveBeenCalled();
  });

  test('should defund user', async () => {
    const generateIdSpy = spyOn(helpers, 'generateId').mockReturnValue('randomId');

    const mockGateway = jest.fn().mockResolvedValue({
      data: {
        status: 200,
        message: 'User defunded successfully',
        success: true,
        data: {}
      }
    });
    mockBizGateway.makeRequest = mockGateway;

    const response = await defundUser(ctx, {
      body: {
        username: 'user',
        amount: 2,
        currency: 'USD',
        reason: 'reason'
      },
      store: { adminDetails: { token: 'token' } }
    });

    expect(response).toEqual({
      statusCode: 200,
      success: true,
      message: 'User defunded successfully',
      data: {}
    });

    expect(mockGateway.mock.calls).toEqual([
      [
        {
          method: 'post',
          path: '/v2/balance/user',
          payload: {
            memo: 'reason',
            currency: 'USD',
            amount: '2',
            receiverUsername: 'payments',
            transferId: 'randomId',
            senderUsername: 'user'
          },
          timeout: 10000,
          otherHeaders: { authorization: 'Bearer token' }
        }
      ]
    ]);
    expect(generateIdSpy).toHaveBeenCalled();
  });
});
