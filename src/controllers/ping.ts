import makeController from '../utils/makeController';

export async function ping() {
  return {
    message: 'pong',
    data: {
      version: process.env.VERSION,
      environment: process.env.APP_ENV,
      appName: process.env.APP_NAME,
      cname: process.env.CONTAINER_NAME
    }
  };
}

export default makeController(ping);
