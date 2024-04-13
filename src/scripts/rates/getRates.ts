import getConfig from '../../config';
import BaseGateway from '../../gateways/baseGateway';
import { logToSlack } from '../../services/slack';

const config = getConfig();
const bybitGateway = new BaseGateway({
  headers: {},
  baseUrl: `${config.BYBIT_CONFIG.baseUrl}`
});
let currentRate = 0;
async function getRate(): Promise<void> {
  try {
    const {
      data: {
        result: { items }
      }
    } = await bybitGateway.makeRequest<BybitResponse>({
      method: 'post',
      path: config.BYBIT_CONFIG.p2pPath,
      payload: {
        userId: '',
        tokenId: 'USDT',
        currencyId: 'NGN',
        payment: [],
        side: '1',
        size: '10',
        page: '1',
        amount: '20000',
        authMaker: true,
        canTrade: false
      }
    });
    const rate = Number(items[0].price);
    if (currentRate == 0) {
      const message = '\n```' + 'current rate: ' + rate + ' NGN/USD' + '```';
      const subject = `*Current Rate On ByBit*`;

      await logToSlack(message, subject, config.CHANNEL_ID);
      currentRate = rate;
    }
    if (Math.abs(rate - currentRate) > 8) {
      const message =
        '\n```' +
        'new rate: ' +
        rate +
        ' NGN/USD' +
        '\n' +
        'previous rate: ' +
        currentRate +
        ' NGN/USD' +
        '```';
      const subject = `*New Rate On ByBit*`;
      await logToSlack(message, subject, config.CHANNEL_ID);
      currentRate = rate;
    }
  } catch (error) {
    await logToSlack(
      `\`new rate\`: error`,
      `***\`Could not fetch rates from ByBit!\`***`,
      config.CHANNEL_ID
    );
    console.log('error getting bybit rate', error);
  }
}

export { getRate };
