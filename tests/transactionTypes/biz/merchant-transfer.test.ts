import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [merchantBalanceWithdrawalTransfer]} = biz_db
describe("Testing Returned Values for Merchant Balance Transfer - Biz", ()=> {

    const shapedMerchantBalanceWithdrawalTransfer = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, merchantBalanceWithdrawalTransfer)
    const merchantBalanceWithdrawalTransferTxn = renameTransactionFields(shapedMerchantBalanceWithdrawalTransfer, 'door')

    test('merchantBalanceWithdrawalTransfer transactions should be an object', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn).toBeDefined
        expect(merchantBalanceWithdrawalTransferTxn).toBeTypeOf('object')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn).toHaveProperty('prevBalance')
        expect(merchantBalanceWithdrawalTransferTxn).toHaveProperty('currentBalance')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.prevBalance).toBeDefined
        expect(merchantBalanceWithdrawalTransferTxn.currentBalance).toBeDefined
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should currentBalance decreased and fee', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.prevBalance).toBe('USD 753.88')
        expect(merchantBalanceWithdrawalTransferTxn.currentBalance).toBe('USD 453.88')
        expect(merchantBalanceWithdrawalTransferTxn.fee).toBe('0.00')
        expect(merchantBalanceWithdrawalTransferTxn.feeCurrency).toBe('USD')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have sender and receiver (username) fields', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.sender).toBe('payout')
        expect(merchantBalanceWithdrawalTransferTxn.username).toBe('collection')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have isMerchantBalanceTransfer property', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.isMerchantBalanceTransfer).toBe(true)
    })
})
