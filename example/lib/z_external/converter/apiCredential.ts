import { ApiCredentialMessage } from "./y_protobuf/api_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../z_vendor/protobufUtil"

import {
    decodeError,
    decodeSuccess,
    TypedStorageConverter,
    TypedStorageValue,
} from "../../z_infra/storage/infra"

export type ApiCredentialDecoded = Readonly<{
    apiRoles: string[]
}>

export function initApiCredentialDataConverter(): TypedStorageConverter<ApiCredentialDecoded> {
    return new Converter()
}

class Converter implements TypedStorageConverter<ApiCredentialDecoded> {
    toRaw(value: ApiCredentialDecoded): string {
        const f = ApiCredentialMessage
        const message = new f()

        // TODO api nonce を追加
        //message.nonce = value.apiNonce
        message.roles = value.apiRoles

        const arr = f.encode(message).finish()
        return encodeUint8ArrayToBase64String(arr)
    }
    toValue(raw: string): TypedStorageValue<ApiCredentialDecoded> {
        try {
            const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))
            const value = {
                apiRoles: message.roles ? message.roles : [],
            }
            return decodeSuccess(value)
        } catch (err) {
            return decodeError(err)
        }
    }
}
