import axios from 'axios';
import sample from './caddyDefault.json';

export default async function setupCaddyReverseProxy(cfg: Config) {
  const service = cfg.APP_NAME;
  const cname = cfg.CONTAINER_NAME;
  const balancerHost = 'http://balancer:2019';
  const listeningPort = ':5000';
  const caddyCfg: typeof sample = (await axios.get(`${balancerHost}/config/`)).data;

  console.log({ service, cname });
  if (service === cname) {
    console.log('no balancer update');
    return;
  }

  for (const [serverName, server] of Object.entries(caddyCfg.apps.http.servers)) {
    if (server.listen.includes(listeningPort)) {
      const routeLen = server.routes.length;
      caddyCfg.apps.http.servers[serverName as keyof typeof caddyCfg.apps.http.servers].routes = [
        ...server.routes.slice(0, routeLen - 1),
        {
          match: [
            {
              path: [`/${cname}*`]
            }
          ],
          handle: [
            {
              handler: 'subroute',
              routes: [
                {
                  handle: [
                    {
                      handler: 'rewrite',
                      strip_path_prefix: `/${cname}`
                    }
                  ]
                },
                {
                  handle: [
                    {
                      handler: 'reverse_proxy',
                      upstreams: [
                        {
                          dial: `${cname}:8080`
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        } as any,
        ...server.routes.slice(routeLen - 1)
      ];
    }
  }
  const res = (await axios.post(`${balancerHost}/load`, caddyCfg)).data;
}
