import { describe, test, expect } from "bun:test";
import { biz_db } from "../../db/transactions/biz";
import { renameTransactionFields } from "../../../src/utils/helpers";
import settings from "../../../src/db/meiliSearch/settings/settings";
import { reshapeMeiliTxn } from "../../../src/db/meiliSearch/settings/transactionSettings";

const {transactiondetails: [,,binanceDeposit]} = biz_db
describe("Testing Returned Values for Binance Pay Deposit", ()=> {

    const shapedBinanceDeposit = reshapeMeiliTxn(settings.mergeCollections.Transactions.mergeShape, binanceDeposit)
    const binanceDepositTxn = renameTransactionFields(shapedBinanceDeposit, 'chang')

    test('binanceDepositTxn transactions should be an object', ()=> {
        expect(binanceDepositTxn).toBeDefined
        expect(binanceDepositTxn).toBeTypeOf('object')
    })

    test('binanceDepositTxn transactions should have prevBalance and currentBalance Properties', ()=> {
        expect(binanceDepositTxn).toHaveProperty('prevBalance')
        expect(binanceDepositTxn).toHaveProperty('currentBalance')
    })

    test('binanceDepositTxn transactions should have prevBalance and currentBalance properties defined', ()=> {
        expect(binanceDepositTxn.prevBalance).toBeDefined
        expect(binanceDepositTxn.currentBalance).toBeDefined
    })

    test('binanceDepositTxn transactions should have currentBalance increased and fee', ()=> {
        expect(binanceDepositTxn.prevBalance).toBe('USD 1,698.49')
        expect(binanceDepositTxn.currentBalance).toBe('USD 1,798.49')
        expect(binanceDepositTxn.fee).toBe('0.00')
        expect(binanceDepositTxn.feeCurrency).toBe('USD')
    })

    test('binanceDepositTxn transactions should have sender and receiverWallet', ()=> {
        expect(binanceDepositTxn.sender).toBe('binancepay')
        expect(binanceDepositTxn.receiverWallet).toBe('chang')
    })
})
