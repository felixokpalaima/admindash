import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

export default function startServer(config: Config, routes: (router: Elysia) => Elysia) {
  const server = new Elysia();
  server.use(cors({}));
  const serverWithRoutes = routes(server);
  serverWithRoutes.listen(config.PORT);
  console.log(
    `🦊 ${config.APP_NAME} is running at http://${server.server?.hostname}:${server.server?.port}`
  );
  return serverWithRoutes;
}
