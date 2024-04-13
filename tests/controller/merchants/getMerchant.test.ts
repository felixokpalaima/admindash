import { describe, expect, test, jest, beforeEach, spyOn } from 'bun:test';
import { getMerchant } from '../../../src/controllers/merchants/merchant/getMerchant';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDb } from '../../../src/db';

describe('Testing Merchant Controllers', () => {
  let ctx: RequestContext;
  beforeEach(async () => {
    jest.restoreAllMocks();
    let envConfigs = getConfig();
    ctx = {
      config: envConfigs,
      dbs: mockDb,
      log: getLogger(''),
      getLogger
    };
  });

  test('should retrieve merchant successfully', async () => {
    const mockUser = {
      username: 'username'
    };
    const mockReq = {
      store: {
        userDetails: {
          user: mockUser
        }
      }
    };
    const result = await getMerchant(ctx, mockReq);
    expect(result).toEqual({
      success: true,
      message: `Merchant [username] retrieved successfully`,
      data: { ...mockUser }
    });
  });
});
