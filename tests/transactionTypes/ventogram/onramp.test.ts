import { describe, test, expect } from "bun:test";
import { ventogram_db } from "../../db/transactions/ventogram";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactions: [onrampTransaction]} = ventogram_db
describe("Testing Returned Values for Onramp", ()=> {

    const shapedOnrampTxn = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, onrampTransaction)
    const onramptxn = renameTransactionFields(shapedOnrampTxn, 'cenoa')

    test('onramp transactions should be an object', ()=> {
        expect(onramptxn).toBeDefined
        expect(onramptxn).toBeTypeOf('object')
    })

    test('onramp transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(onramptxn).toHaveProperty('prevBalance')
        expect(onramptxn).toHaveProperty('currentBalance')
    })

    test('onramp transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(onramptxn.prevBalance).toBeDefined
        expect(onramptxn.currentBalance).toBeDefined

    })

    test('onramp transactions should currentBalance reduced, prevBalance divided by 100 and fee', ()=> {
        expect(onramptxn.prevBalance).toBe('USDC 0.05')
        expect(onramptxn.currentBalance).toBe('USDC 0.01')
        expect(onramptxn.fee).toBe('0.04')
    })

    test('onramp transactions should have sender and receiver (username) fields', ()=> {
        expect(onramptxn.sender).toBe('cenoa')
        expect(onramptxn.username).toBe('0x24a37F8f0C345F3BE71B1BC693432F2C4E1bB420')
    })

})


