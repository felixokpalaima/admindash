import { expect, describe, test } from 'bun:test';
import startServer from '../../src/server';
import getConfig from '../../src/config';
import getRoutes from '../../src/routes';
import getLogger from '../../src/logging';

describe('GET /ping', () => {
  test.skip('should return 200 pong', async () => {
    const envConfig = getConfig();
    const app = startServer(
      envConfig,
      getRoutes({ config: envConfig, dbs: {} as any, log: getLogger(''), getLogger })
    );
    const response = await app.handle(new Request('http://localhost/ping')).then((res) => res);
    expect(response.status).toBe(200);

    expect(((await response.json()) as any).message).toBe('pong');
  });
});
