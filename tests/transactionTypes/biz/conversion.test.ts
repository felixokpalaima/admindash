import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,,,conversionTransactionDetails]} = biz_db
describe("Testing Returned Values for Conversion - Biz", ()=> {

    const shapedConversionTransaction = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, conversionTransactionDetails)
    const conversionTxn = renameTransactionFields(shapedConversionTransaction, 'omollc')

    test('conversionTxn transactions should be an object', ()=> {
        expect(conversionTxn).toBeDefined
        expect(conversionTxn).toBeTypeOf('object')
    })

    test('conversionTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(conversionTxn).toHaveProperty('prevBalance')
        expect(conversionTxn).toHaveProperty('currentBalance')
    })

    test('conversionTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(conversionTxn.prevBalance).toBeDefined
        expect(conversionTxn.currentBalance).toBeDefined
    })

    test('conversionTxn transactions should currentBalance decrease and fee', ()=> {
        expect(conversionTxn.prevBalance).toBe('USD 427.57')
        expect(conversionTxn.currentBalance).toBe('USD 381.83')
        expect(conversionTxn.fee).toBe('0.00')
        expect(conversionTxn.feeCurrency).toBe('USD')
    })

})
