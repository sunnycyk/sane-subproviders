"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0xproject/utils");
/**
 * A altered version of the base class Subprovider found in [web3-provider-engine](https://github.com/MetaMask/provider-engine).
 * This one has an async/await `emitPayloadAsync` and also defined types.
 */
class Subprovider {
    static _createFinalPayload(payload) {
        const finalPayload = Object.assign({ 
            // defaults
            id: Subprovider._getRandomId(), jsonrpc: '2.0', params: [] }, payload);
        return finalPayload;
    }
    // Ported from: https://github.com/MetaMask/provider-engine/blob/master/util/random-id.js
    static _getRandomId() {
        const extraDigits = 3;
        const baseTen = 10;
        // 13 time digits
        const datePart = new Date().getTime() * Math.pow(baseTen, extraDigits);
        // 3 random digits
        const extraPart = Math.floor(Math.random() * Math.pow(baseTen, extraDigits));
        // 16 digits
        return datePart + extraPart;
    }
    /**
     * Emits a JSON RPC payload that will then be handled by the ProviderEngine instance
     * this subprovider is a part of. The payload will cascade down the subprovider middleware
     * stack until finding the responsible entity for handling the request.
     * @param payload JSON RPC payload
     * @returns JSON RPC response payload
     */
    async emitPayloadAsync(payload) {
        const finalPayload = Subprovider._createFinalPayload(payload);
        const response = await utils_1.promisify(this.engine.sendAsync, this.engine)(finalPayload);
        return response;
    }
    /**
     * Set's the subprovider's engine to the ProviderEngine it is added to.
     * This is only called within the ProviderEngine source code, do not call
     * directly.
     */
    setEngine(engine) {
        this.engine = engine;
    }
}
exports.Subprovider = Subprovider;
//# sourceMappingURL=subprovider.js.map