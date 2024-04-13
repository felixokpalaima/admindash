import makeController from '../utils/makeController';

async function Notfound() {
  return {
    statusCode: 404,
    body: {
      message: 'Not Found'
    }
  };
}

export default makeController(Notfound);
