import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,,,,,,cryptoDeposit]} = biz_db
describe("Testing Returned Values for Crypto Deposit", ()=> {

    const shapedCryptoDeposit = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, cryptoDeposit)
    const cryptoDepositTxn = renameTransactionFields(shapedCryptoDeposit, 'chang')

    test('cryptoDepositTxn transactions should be an object', ()=> {
        expect(cryptoDepositTxn).toBeDefined
        expect(cryptoDepositTxn).toBeTypeOf('object')
    })

    test('cryptoDepositTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(cryptoDepositTxn).toHaveProperty('prevBalance')
        expect(cryptoDepositTxn).toHaveProperty('currentBalance')
    })

    test('cryptoDepositTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(cryptoDepositTxn.prevBalance).toBeDefined
        expect(cryptoDepositTxn.currentBalance).toBeDefined
    })

    test('cryptoDepositTxn transactions should have currentBalance increased and fee', ()=> {
        expect(cryptoDepositTxn.prevBalance).toBe('USD 1,755.36')
        expect(cryptoDepositTxn.currentBalance).toBe('USD 1,784.36')
        expect(cryptoDepositTxn.fee).toBe('0.00')
        expect(cryptoDepositTxn.feeCurrency).toBe('USDC')
    })

    test('cryptoDepositTxn transactions should have network', ()=> {
        expect(cryptoDepositTxn).toHaveProperty('network')
        expect(cryptoDepositTxn.network).toBeDefined
    })
})
