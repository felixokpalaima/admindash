import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,,,,,refundTransaction]} = biz_db
describe("Testing Returned Values for Refund", ()=> {

    const shapedRefundTransaction = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, refundTransaction)
    const refundTxn = renameTransactionFields(shapedRefundTransaction, 'chang')

    test('refundTxn transactions should be an object', ()=> {
        expect(refundTxn).toBeDefined
        expect(refundTxn).toBeTypeOf('object')
    })

    test('refundTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(refundTxn).toHaveProperty('prevBalance')
        expect(refundTxn).toHaveProperty('currentBalance')
    })

    test('refundTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(refundTxn.prevBalance).toBeDefined
        expect(refundTxn.currentBalance).toBeDefined
    })

    test('refundTxn transactions should have currentBalance increased and fee', ()=> {
        expect(refundTxn.prevBalance).toBe('USD 2,464.04')
        expect(refundTxn.currentBalance).toBe('USD 2,499.18')
        expect(refundTxn.fee).toBe('0.00')
        expect(refundTxn.feeCurrency).toBe('USD')
    })

    test('refundTxn transactions should have network', ()=> {
        expect(refundTxn).toHaveProperty('network')
        expect(refundTxn.network).toBeDefined
    })
})
