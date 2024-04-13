import { AxiosError } from 'axios';
import { sendOtp } from '../../../utils/helpers';
import makeController from '../../../utils/makeController';

export async function payoutTransferOTP(ctx: RequestContext, req: any) {
  try {
    const { amount, currency } = req.body;
    const {
      userDetails: { token }
    } = req.store;

    await sendOtp({
      purpose: 'internalTransfer',
      currency,
      amount,
      account: 'ventogram',
      token
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Successfully sent payout balance transfer OTP to email'
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
      message: 'Payout balance transfer OTP email request errored'
    };
  }
}

export default makeController(payoutTransferOTP);
