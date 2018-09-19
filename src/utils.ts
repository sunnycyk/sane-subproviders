import { addressUtils, BigNumber } from '@0xproject/utils';
import * as _ from 'lodash';

function assert(cond: boolean, msg: string): void {
    if (!cond) {
        throw new Error(msg)
    }
}

export const utils = {

    assertETHAddressHex(value: string): void {
        assert(_.isString(value), `Expected "string", got ${typeof value}`)
        assert(addressUtils.isAddress(value), `Not a valid ethereum address: ${value}`)
    },

    assertHexString(value: string): void {
        assert(
            _.isString(value) && (/^0x[0-9A-F]*$/i).test(value),
            `Expected hex string, got value "${value}"`
        );
    },

    assertString(value: string): void {
        assert(
            _.isString(value),
            `Expected type "string", got "${typeof value}"`
        );
    },

    assertNumber(value: number): void {
        assert(
            _.isFinite(value),
            `Expected type "number", got "${typeof value} with value "${value}""`
        );
    },

}
