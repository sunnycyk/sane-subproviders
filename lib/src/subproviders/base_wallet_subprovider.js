"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0xproject/utils");
const _ = require("lodash");
const types_1 = require("../types");
const utils_2 = require("../utils");
const subprovider_1 = require("./subprovider");
class BaseWalletSubprovider extends subprovider_1.Subprovider {
    static _validateTxParams(txParams) {
        if (!_.isUndefined(txParams.to)) {
            utils_2.utils.assertETHAddressHex(txParams.to);
        }
        utils_2.utils.assertHexString(txParams.nonce);
    }
    static _validateSender(sender) {
        if (_.isUndefined(sender) || !utils_1.addressUtils.isAddress(sender)) {
            throw new Error(types_1.WalletSubproviderErrors.SenderInvalidOrNotSupplied);
        }
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:async-suffix
    async handleRequest(payload, next, end) {
        let accounts;
        let txParams;
        switch (payload.method) {
            case 'eth_coinbase':
                try {
                    accounts = await this.getAccountsAsync();
                    end(null, accounts[0]);
                }
                catch (err) {
                    end(err);
                }
                return;
            case 'eth_accounts':
                try {
                    accounts = await this.getAccountsAsync();
                    end(null, accounts);
                }
                catch (err) {
                    end(err);
                }
                return;
            case 'eth_sendTransaction':
                txParams = payload.params[0];
                try {
                    BaseWalletSubprovider._validateSender(txParams.from);
                    const filledParams = await this._populateMissingTxParamsAsync(txParams);
                    const signedTx = await this.signTransactionAsync(filledParams);
                    const response = await this._emitSendTransactionAsync(signedTx);
                    end(null, response.result);
                }
                catch (err) {
                    end(err);
                }
                return;
            case 'eth_signTransaction':
                txParams = payload.params[0];
                try {
                    const filledParams = await this._populateMissingTxParamsAsync(txParams);
                    const signedTx = await this.signTransactionAsync(filledParams);
                    const result = {
                        raw: signedTx,
                        tx: txParams,
                    };
                    end(null, result);
                }
                catch (err) {
                    end(err);
                }
                return;
            case 'eth_sign':
            case 'personal_sign':
                const data = payload.method === 'eth_sign' ? payload.params[1] : payload.params[0];
                const address = payload.method === 'eth_sign' ? payload.params[0] : payload.params[1];
                try {
                    const ecSignatureHex = await this.signPersonalMessageAsync(data, address);
                    end(null, ecSignatureHex);
                }
                catch (err) {
                    end(err);
                }
                return;
            default:
                next();
                return;
        }
    }
    async _emitSendTransactionAsync(signedTx) {
        const payload = {
            method: 'eth_sendRawTransaction',
            params: [signedTx],
        };
        const result = await this.emitPayloadAsync(payload);
        return result;
    }
    async _populateMissingTxParamsAsync(partialTxParams) {
        let txParams = partialTxParams;
        if (_.isUndefined(partialTxParams.gasPrice)) {
            const gasPriceResult = await this.emitPayloadAsync({
                method: 'eth_gasPrice',
                params: [],
            });
            const gasPrice = gasPriceResult.result.toString();
            txParams = Object.assign({}, txParams, { gasPrice });
        }
        if (_.isUndefined(partialTxParams.nonce)) {
            const nonceResult = await this.emitPayloadAsync({
                method: 'eth_getTransactionCount',
                params: [partialTxParams.from, 'pending'],
            });
            const nonce = nonceResult.result;
            txParams = Object.assign({}, txParams, { nonce });
        }
        if (_.isUndefined(partialTxParams.gas)) {
            const gasResult = await this.emitPayloadAsync({
                method: 'eth_estimateGas',
                params: [partialTxParams],
            });
            const gas = gasResult.result.toString();
            txParams = Object.assign({}, txParams, { gas });
        }
        return txParams;
    }
}
exports.BaseWalletSubprovider = BaseWalletSubprovider;
//# sourceMappingURL=base_wallet_subprovider.js.map