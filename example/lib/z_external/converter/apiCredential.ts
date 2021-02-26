import { ApiCredentialMessage } from "./y_protobuf/api_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../z_vendor/protobuf/transform"

import { decodeError, decodeSuccess, TypedStorageConverter } from "../../z_vendor/getto-application/storage/typed/infra"

export type ApiCredentialDecoded = Readonly<{
    apiNonce: string
    apiRoles: string[]
}>

export function initApiCredentialDataConverter(): TypedStorageConverter<ApiCredentialDecoded> {
    return {
        toRaw: (value: ApiCredentialDecoded) => {
            const f = ApiCredentialMessage
            const message = new f()

            message.nonce = value.apiNonce
            message.roles = value.apiRoles

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        toValue: (raw: string) => {
            try {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))
                const value: ApiCredentialDecoded = {
                    apiNonce: message.nonce ? message.nonce : "",
                    apiRoles: message.roles ? message.roles : [],
                }
                return decodeSuccess(value)
            } catch (err) {
                return decodeError(err)
            }
        },
    }
}
