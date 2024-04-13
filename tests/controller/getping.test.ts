import { describe, expect, test } from 'bun:test';
import { ping } from '../../src/controllers/ping';

describe('GET Ping controller', () => {
  test('should return pong message', async () => {
    const response = await ping();
    expect(response.message).toBe('pong');
  });
});
