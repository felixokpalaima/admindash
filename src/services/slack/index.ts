import axios from 'axios';
import getConfig from '../../config';
axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

const config = getConfig();
async function logToSlack(
  data: string,
  message: string,
  channelId: string,
  threadTs?: string,
  reply_broadcast: boolean = false
) {
  try {
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.SLACK_TOKEN}`
      },
      timeout: 10000
    };

    const payload = {
      blocks: [
        {
          type: 'section',
          text: {
            text: message,
            type: 'mrkdwn'
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          text: {
            text: data,
            type: 'mrkdwn'
          }
        }
      ],
      unfurl_links: false,
      unfurl_media: false,
      channel: channelId,
      thread_ts: threadTs,
      reply_broadcast
    };

    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      payload,
      requestConfig
    );
    return response.data;
  } catch (error) {
    return;
  }
}

export { logToSlack };
