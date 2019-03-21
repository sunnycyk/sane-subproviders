"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@0xproject/types");
const utils_1 = require("@0xproject/utils");
const JsonRpcError = require("json-rpc-error");
const utils_2 = require("../utils");
const subprovider_1 = require("./subprovider");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It forwards on JSON RPC requests to the supplied `rpcUrl` endpoint
 */
class RPCSubprovider extends subprovider_1.Subprovider {
    constructor(rpcUrl, requestTimeoutMs = 20000) {
        super();
        utils_2.utils.assertString(rpcUrl);
        utils_2.utils.assertNumber(requestTimeoutMs);
        this._rpcUrl = rpcUrl;
        this._requestTimeoutMs = requestTimeoutMs;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    async handleRequest(payload, _next, end) {
        const finalPayload = subprovider_1.Subprovider._createFinalPayload(payload);
        const headers = new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        });
        let response;
        try {
            response = await utils_1.fetchAsync(this._rpcUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(finalPayload),
            }, this._requestTimeoutMs);
        }
        catch (err) {
            end(new JsonRpcError.InternalError(err));
            return;
        }
        const text = await response.text();
        if (!response.ok) {
            const statusCode = response.status;
            switch (statusCode) {
                case types_1.StatusCodes.MethodNotAllowed:
                    end(new JsonRpcError.MethodNotFound());
                    return;
                case types_1.StatusCodes.GatewayTimeout:
                    const errMsg = 'Gateway timeout. The request took too long to process. This can happen when querying logs over too wide a block range.';
                    const err = new Error(errMsg);
                    end(new JsonRpcError.InternalError(err));
                    return;
                default:
                    end(new JsonRpcError.InternalError(text));
                    return;
            }
        }
        let data;
        try {
            data = JSON.parse(text);
        }
        catch (err) {
            end(new JsonRpcError.InternalError(err));
            return;
        }
        if (data.error) {
            end(new Error(data.error.message));
            return;
        }
        end(null, data.result);
    }
}
exports.RPCSubprovider = RPCSubprovider;
//# sourceMappingURL=rpc_subprovider.js.map