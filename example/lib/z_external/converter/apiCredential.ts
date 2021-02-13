import { ApiCredentialMessage } from "./y_protobuf/api_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../z_vendor/protobufUtil"

import { decodeError, decodeSuccess, TypedStorageConverter } from "../../z_infra/storage/infra"

export type ApiCredentialDecoded = Readonly<{
    nonce: string
    roles: string[]
}>

export function initApiCredentialDataConverter(): TypedStorageConverter<ApiCredentialDecoded> {
    return {
        toRaw: (value: ApiCredentialDecoded) => {
            const f = ApiCredentialMessage
            const message = new f()

            message.nonce = value.nonce
            message.roles = value.roles

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        toValue: (raw: string) => {
            try {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))
                const value = {
                    nonce: message.nonce ? message.nonce : "",
                    roles: message.roles ? message.roles : [],
                }
                return decodeSuccess(value)
            } catch (err) {
                return decodeError(err)
            }
        },
    }
}
