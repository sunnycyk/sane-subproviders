"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0xproject/utils");
var _ = require("lodash");
function assert(cond, msg) {
    if (!cond) {
        throw new Error(msg);
    }
}
exports.utils = {
    assertETHAddressHex: function (value) {
        assert(_.isString(value), "Expected \"string\", got " + typeof value);
        assert(utils_1.addressUtils.isAddress(value), "Not a valid ethereum address: " + value);
    },
    assertHexString: function (value) {
        assert(_.isString(value) && (/^0x[0-9A-F]*$/i).test(value), "Expected hex string, got value \"" + value + "\"");
    },
    assertString: function (value) {
        assert(_.isString(value), "Expected type \"string\", got \"" + typeof value + "\"");
    },
    assertNumber: function (value) {
        assert(_.isFinite(value), "Expected type \"number\", got \"" + typeof value + " with value \"" + value + "\"\"");
    },
};
//# sourceMappingURL=utils.js.map