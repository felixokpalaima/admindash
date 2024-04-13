import { AxiosError } from 'axios';
import { ventogramGateway } from '../../../gateways/ventogram';
import makeController from '../../../utils/makeController';

export async function collectionTransfer(ctx: RequestContext, req: any) {
  try {
    const { amount, currency } = req.body;
    const {
      userDetails: { token }
    } = req.store;

    const payload = {
      amount,
      currency
    };

    const requestToTransfer = await ventogramGateway.makeRequest<CollectionBalanceTransferRes>({
      otherHeaders: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      path: `/api/v1/admin/transfer-balance`,
      payload
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Collection balance transfer successful',
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
      message: 'Collection balance transfer request errored'
    };
  }
}

export default makeController(collectionTransfer);
