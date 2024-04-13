import { Mongoose } from 'mongoose';

const connectToMultipleDbs = async (
  remote: Record<string, { uri: string; collections: string[] }>
) => {
  const mongoose = new Mongoose();
  let urls = {} as Record<string, string>;
  let connections = {} as ConnectedDbs;
  for (const dbName in remote) {
    let uri = remote[dbName]['uri'];
    urls[dbName] = uri;
  }
  for (const k in urls) {
    if (urls.hasOwnProperty(k)) {
      const connectionString = urls[k];
      const connection = await mongoose.createConnection(connectionString);
      connection.on('error', (error) => {
        // log.withData({info: config.app}).info(`failed to connect to ${k}`)
      });
      connection.once('open', () => {
        // log.withData({info: config.app}).info(`connected to ${k}`)
      });
      connections[k as DbName] = await connection.asPromise();
    }
  }
  return { connections, mongoose };
};

export { connectToMultipleDbs };
