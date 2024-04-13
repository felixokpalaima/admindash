import { AxiosError } from 'axios';
import { bizGateway } from '../../../gateways/biz';
import makeController from '../../../utils/makeController';

export async function payoutTransfer(ctx: RequestContext, req: any) {
  try {
    const { amount, currency, otp, otpType, receiveCurrency } = req.body;
    const {
      userDetails: { token }
    } = req.store;

    const payload = {
      amount,
      currency,
      otpType,
      receiveCurrency,
      receiverUsername: 'ventogram',
      token: otp
    };

    const requestToTransfer = await bizGateway.makeRequest<PayoutBalanceTransferRes>({
      method: 'POST',
      path: `/v2/balance/transfer`,
      payload,
      otherHeaders: { authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Payout balance transfer successful',
      data: requestToTransfer.data.data
    };
  } catch (error: any) {
    ctx.getLogger('error').error(error.message);
    if (error instanceof AxiosError && error.response?.status === 400) {
      return {
        success: false,
        statusCode: 400,
        message: error.response?.data?.message
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: error?.response?.data?.message ?? 'Payout balance transfer request errored'
    };
  }
}

export default makeController(payoutTransfer);
