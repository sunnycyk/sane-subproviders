"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EthereumTx = require("ethereumjs-tx");
const ethUtil = require("ethereumjs-util");
const _ = require("lodash");
const types_1 = require("../types");
const utils_1 = require("../utils");
const base_wallet_subprovider_1 = require("./base_wallet_subprovider");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * This subprovider intercepts all account related RPC requests (e.g message/transaction signing, etc...) and handles
 * all requests with the supplied Ethereum private key.
 */
class PrivateKeyWalletSubprovider extends base_wallet_subprovider_1.BaseWalletSubprovider {
    /**
     * Instantiates a PrivateKeyWalletSubprovider.
     * @param privateKey The corresponding private key to an Ethereum address
     * @return PrivateKeyWalletSubprovider instance
     */
    constructor(privateKey) {
        utils_1.utils.assertString(privateKey);
        super();
        this._privateKeyBuffer = new Buffer(privateKey, 'hex');
        this._address = `0x${ethUtil.privateToAddress(this._privateKeyBuffer).toString('hex')}`;
    }
    /**
     * Retrieve the account associated with the supplied private key.
     * This method is implicitly called when issuing a `eth_accounts` JSON RPC request
     * via your providerEngine instance.
     * @return An array of accounts
     */
    async getAccountsAsync() {
        return [this._address];
    }
    /**
     * Sign a transaction with the private key. If you've added this Subprovider to your
     * app's provider, you can simply send an `eth_sendTransaction` JSON RPC request, and
     * this method will be called auto-magically. If you are not using this via a ProviderEngine
     * instance, you can call it directly.
     * @param txParams Parameters of the transaction to sign
     * @return Signed transaction hex string
     */
    async signTransactionAsync(txParams) {
        PrivateKeyWalletSubprovider._validateTxParams(txParams);
        if (!_.isUndefined(txParams.from) && txParams.from !== this._address) {
            throw new Error(`Requested to sign transaction with address: ${txParams.from}, instantiated with address: ${this._address}`);
        }
        const tx = new EthereumTx(txParams);
        tx.sign(this._privateKeyBuffer);
        const rawTx = `0x${tx.serialize().toString('hex')}`;
        return rawTx;
    }
    /**
     * Sign a personal Ethereum signed message. The signing address will be calculated from the private key.
     * The address must be provided it must match the address calculated from the private key.
     * If you've added this Subprovider to your app's provider, you can simply send an `eth_sign`
     * or `personal_sign` JSON RPC request, and this method will be called auto-magically.
     * If you are not using this via a ProviderEngine instance, you can call it directly.
     * @param data Hex string message to sign
     * @param address Address of the account to sign with
     * @return Signature hex string (order: rsv)
     */
    async signPersonalMessageAsync(data, address) {
        if (_.isUndefined(data)) {
            throw new Error(types_1.WalletSubproviderErrors.DataMissingForSignPersonalMessage);
        }
        utils_1.utils.assertHexString(data);
        utils_1.utils.assertETHAddressHex(address);
        if (address !== this._address) {
            throw new Error(`Requested to sign message with address: ${address}, instantiated with address: ${this._address}`);
        }
        const dataBuff = ethUtil.toBuffer(data);
        const msgHashBuff = ethUtil.hashPersonalMessage(dataBuff);
        const sig = ethUtil.ecsign(msgHashBuff, this._privateKeyBuffer);
        const rpcSig = ethUtil.toRpcSig(sig.v, sig.r, sig.s);
        return rpcSig;
    }
}
exports.PrivateKeyWalletSubprovider = PrivateKeyWalletSubprovider;
//# sourceMappingURL=private_key_wallet.js.map