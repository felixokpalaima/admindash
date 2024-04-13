import { describe, test, expect } from "bun:test";
import { ventogram_db } from "../../db/transactions/ventogram";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactions: [,,merchantBalanceWithdrawalTransfer]} = ventogram_db
describe("Testing Returned Values for Merchant Balance Transfer", ()=> {

    const shapedMerchantBalanceWithdrawalTransfer = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, merchantBalanceWithdrawalTransfer)
    const merchantBalanceWithdrawalTransferTxn = renameTransactionFields(shapedMerchantBalanceWithdrawalTransfer, 'account')

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

    test('merchantBalanceWithdrawalTransferTxn transactions should currentBalance increased, prevBalance divided by 100 and fee', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.prevBalance).toBe('NGN 140,000.09')
        expect(merchantBalanceWithdrawalTransferTxn.currentBalance).toBe('NGN 130,000.09')
        expect(merchantBalanceWithdrawalTransferTxn.fee).toBe('0.00')
        expect(merchantBalanceWithdrawalTransferTxn.feeCurrency).toBe('NGN')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have sender and receiver (username) fields', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.sender).toBe('collection')
        expect(merchantBalanceWithdrawalTransferTxn.username).toBe('payout')
    })

    test('merchantBalanceWithdrawalTransferTxn transactions should have isMerchantBalanceTransfer property', ()=> {
        expect(merchantBalanceWithdrawalTransferTxn.isMerchantBalanceTransfer).toBe(true)

    })


})


