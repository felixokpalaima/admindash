import { describe, expect, test, jest, beforeEach, spyOn, mock } from 'bun:test';
import { dropIndex } from '../../../src/controllers/dbOperations/dropIndex';
import getLogger from '../../../src/logging';
import getConfig from '../../../src/config';
import { dbs as mockDb } from '../../../src/db';

describe('Testing Db Ops Controllers', () => {
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

  test('should drop index successfully', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        indexDropper: async () => {
          return {
            taskUid: 4,
            indexUid: 'Transactions',
            status: 'enqueued',
            type: 'indexDeletion',
            enqueuedAt: new Date('2023-12-20T22:07:06.727Z')
          };
        }
      };
    });

    let ops = await import('../../../src/db/meiliSearch/managers');
    const dropIndexSpy = spyOn(ops, 'indexDropper');

    const mockReq = {
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      },
      query: { index: 'Transactions' }
    };

    const result = await dropIndex(ctx, mockReq);

    expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: 'successful',
      data: {
        taskUid: 4,
        indexUid: 'Transactions',
        status: 'enqueued',
        type: 'indexDeletion',
        enqueuedAt: new Date('2023-12-20T22:07:06.727Z')
      }
    });

    expect(dropIndexSpy).toHaveBeenCalledTimes(1);
  });

  test('should jump to catch block', async () => {
    mock.module('../../../src/db/meiliSearch/managers', () => {
      return {
        indexDropper: async () => {
          throw new Error();
        }
      };
    });

    let ops = await import('../../../src/db/meiliSearch/managers');
    const dropIndexSpy = spyOn(ops, 'indexDropper');

    const mockReq = {
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      },
      query: { index: 'Transactions' }
    };

    const result = await dropIndex(ctx, mockReq);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      message: 'could not drop index'
    });

    expect(dropIndexSpy).toHaveBeenCalledTimes(1);
  });
});
