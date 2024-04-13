import { describe, expect, test, jest, beforeEach, spyOn, mock } from 'bun:test';
import { addDocsToMeili } from '../../../src/controllers/dbOperations/addDocs';
import getLogger from '../../../src/logging';
// import * as ops from '../../../src/db/meiliSearch/fetchData'
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

  test('should merge transactions successfully', async () => {
    mock.module('../../../src/db/meiliSearch/fetchData', () => {
      return {
        runConnectionAndMerge: jest.fn().mockResolvedValue('done')
      };
    });

    let ops = await import('../../../src/db/meiliSearch/fetchData');
    const runMergeSpy = spyOn(ops, 'runConnectionAndMerge');

    const mockReq = {
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      }
    };

    const result = await addDocsToMeili(ctx, mockReq);

    expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: 'successful',
      data: 'done'
    });

    expect(runMergeSpy).toHaveBeenCalledTimes(1);
  });

  test('should jump to catch block', async () => {
    mock.module('../../../src/db/meiliSearch/fetchData', () => {
      return {
        runConnectionAndMerge: async () => {
          throw new Error('Error occured');
        }
      };
    });

    let ops = await import('../../../src/db/meiliSearch/fetchData');
    const runMergeSpy = spyOn(ops, 'runConnectionAndMerge');

    const mockReq = {
      store: {
        userDetails: {
          user: {
            username: 'username'
          }
        }
      }
    };

    const result = await addDocsToMeili(ctx, mockReq);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      message: 'could not merge collection from mongoose',
      data: new Error('Error occured')
    });

    expect(runMergeSpy).toHaveBeenCalledTimes(1);
  });
});
