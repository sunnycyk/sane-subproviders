"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0xproject/utils");
const _ = require("lodash");
function assert(cond, msg) {
    if (!cond) {
        throw new Error(msg);
    }
}
exports.utils = {
    assertETHAddressHex(value) {
        assert(_.isString(value), `Expected "string", got ${typeof value}`);
        assert(utils_1.addressUtils.isAddress(value), `Not a valid ethereum address: ${value}`);
    },
    assertHexString(value) {
        assert(_.isString(value) && (/^0x[0-9A-F]*$/i).test(value), `Expected hex string, got value "${value}"`);
    },
    assertString(value) {
        assert(_.isString(value), `Expected type "string", got "${typeof value}"`);
    },
    assertNumber(value) {
        assert(_.isFinite(value), `Expected type "number", got "${typeof value} with value "${value}""`);
    },
};
//# sourceMappingURL=utils.js.map