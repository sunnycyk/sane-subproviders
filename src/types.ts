import { ECSignature } from '@0xproject/types';
import { JSONRPCRequestPayload } from 'ethereum-types';

export interface PartialTxParams {
    nonce: string;
    gasPrice?: string;
    gas: string;
    to: string;
    from: string;
    value?: string;
    data?: string;
    chainId: number; // EIP 155 chainId - mainnet: 1, ropsten: 3
}

export enum WalletSubproviderErrors {
    AddressNotFound = 'ADDRESS_NOT_FOUND',
    DataMissingForSignPersonalMessage = 'DATA_MISSING_FOR_SIGN_PERSONAL_MESSAGE',
    SenderInvalidOrNotSupplied = 'SENDER_INVALID_OR_NOT_SUPPLIED',
    FromAddressMissingOrInvalid = 'FROM_ADDRESS_MISSING_OR_INVALID',
}

export type ErrorCallback = (err: Error | null, data?: any) => void;
export type Callback = () => void;
export type OnNextCompleted = (err: Error | null, result: any, cb: Callback) => void;
export type NextCallback = (callback?: OnNextCompleted) => void;

export interface JSONRPCRequestPayloadWithMethod extends JSONRPCRequestPayload {
    method: string;
}
