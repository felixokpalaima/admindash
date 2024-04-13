import axios from 'axios';
import { logToSlack } from '../../services/slack';
axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

const paths: Record<Services, string> = {
  bend: '/api/ping',
  biz: '/ping',
  cards: '/ping',
  remit: '/ping',
  waas: '/ping',
  ventogram: '/api/ping'
};
export default async function pingAll(config: Config) {
  const { BASE_URLS: urlsObj, CHANNEL_ID } = config;
  let service: Services;
  let statuses: Record<Services, any> = {} as Record<Services, any>;
  for (service in urlsObj) {
    const url = urlsObj[service];
    try {
      const pinged = await axios.get<BaseResponse>(`${url}${paths[service]}`);
      const {
        data: {
          success,
          message,
          data: { version }
        }
      } = pinged;
      if (success) {
        statuses[service] = { success, version, message };
      } else {
        //log to slack
        statuses[service] = { success: false, version: '', message: 'not reachable' };
        await logToSlack(`${service} unavailable`, `***Service Down***`, CHANNEL_ID);
      }
    } catch (error) {
      //log to slack could not reach a service
      await logToSlack(`${service} unavailable`, `***Service Down***`, CHANNEL_ID);
      statuses[service] = { success: false, version: '', message: 'not reachable' };
    }
  }
}
