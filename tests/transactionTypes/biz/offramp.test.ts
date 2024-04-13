import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,offrampTransactionDetails]} = biz_db
describe("Testing Returned Values for Offramp", ()=> {

    const shapedOfframpTransaction = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, offrampTransactionDetails)
    const offrampTxn = renameTransactionFields(shapedOfframpTransaction, 'cenoaapp')

    test('offrampTxn transactions should be an object', ()=> {
        expect(offrampTxn).toBeDefined
        expect(offrampTxn).toBeTypeOf('object')
    })

    test('offrampTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(offrampTxn).toHaveProperty('prevBalance')
        expect(offrampTxn).toHaveProperty('currentBalance')
    })

    test('offrampTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(offrampTxn.prevBalance).toBeDefined
        expect(offrampTxn.currentBalance).toBeDefined
    })

    test('offrampTxn transactions should currentBalance decreased and fee', ()=> {
        expect(offrampTxn.prevBalance).toBe('NGN 0')
        expect(offrampTxn.currentBalance).toBe('NGN 0')
        expect(offrampTxn.fee).toBe('0.1')
        expect(offrampTxn.feeCurrency).toBe('USDC')
    })

    test('offrampTxn transactions should have receiverBank field', ()=> {
        expect(offrampTxn).toHaveProperty('receiverBank')
        expect(offrampTxn.receiverBank).toBeDefined
    })

})
