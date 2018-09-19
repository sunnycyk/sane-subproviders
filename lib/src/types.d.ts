import { JSONRPCRequestPayload } from 'ethereum-types';
export interface PartialTxParams {
    nonce: string;
    gasPrice?: string;
    gas: string;
    to: string;
    from: string;
    value?: string;
    data?: string;
    chainId: number;
}
export declare enum WalletSubproviderErrors {
    AddressNotFound = "ADDRESS_NOT_FOUND",
    DataMissingForSignPersonalMessage = "DATA_MISSING_FOR_SIGN_PERSONAL_MESSAGE",
    SenderInvalidOrNotSupplied = "SENDER_INVALID_OR_NOT_SUPPLIED",
    FromAddressMissingOrInvalid = "FROM_ADDRESS_MISSING_OR_INVALID"
}
export declare type ErrorCallback = (err: Error | null, data?: any) => void;
export declare type Callback = () => void;
export declare type OnNextCompleted = (err: Error | null, result: any, cb: Callback) => void;
export declare type NextCallback = (callback?: OnNextCompleted) => void;
export interface JSONRPCRequestPayloadWithMethod extends JSONRPCRequestPayload {
    method: string;
}
//# sourceMappingURL=types.d.ts.map