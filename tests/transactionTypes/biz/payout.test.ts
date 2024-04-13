import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,,payoutTransactionDetails]} = biz_db
describe("Testing Returned Values for Merchant Balance Transfer - Biz", ()=> {

    const shapedPayoutTransaction = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, payoutTransactionDetails)
    const payoutTxn = renameTransactionFields(shapedPayoutTransaction, 'omollc')

    test('payoutTxn transactions should be an object', ()=> {
        expect(payoutTxn).toBeDefined
        expect(payoutTxn).toBeTypeOf('object')
    })

    test('payoutTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(payoutTxn).toHaveProperty('prevBalance')
        expect(payoutTxn).toHaveProperty('currentBalance')
    })

    test('payoutTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(payoutTxn.prevBalance).toBeDefined
        expect(payoutTxn.currentBalance).toBeDefined
    })

    test('payoutTxn transactions should currentBalance decreased and fee', ()=> {
        expect(payoutTxn.prevBalance).toBe('NGN 8,735.06')
        expect(payoutTxn.currentBalance).toBe('NGN 1,448.11')
        expect(payoutTxn.fee).toBe('100.00')
        expect(payoutTxn.feeCurrency).toBe('NGN')
    })

    test('payoutTxn transactions should have receiverBank field', ()=> {
        expect(payoutTxn).toHaveProperty('receiverBank')
        expect(payoutTxn.receiverBank).toBeDefined
    })

})
