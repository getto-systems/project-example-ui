import { AuthnMessage } from "../y_protobuf/auth_pb.js"

import { initDB } from "../base"

import { DB } from "../infra"
import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../z_vendor/base64/transform"

type Authn = Readonly<{
    nonce: string
    authAt: string
}>
export function newDB_Authn(storage: Storage, key: string): DB<Authn> {
    return initDB(storage, key, {
        toString: (value: Authn) => {
            const f = AuthnMessage
            const message = new f()

            message.nonce = value.nonce
            message.authAt = value.authAt

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        fromString: (raw: string) => {
            const message = AuthnMessage.decode(decodeBase64StringToUint8Array(raw))
            return {
                nonce: message.nonce || "",
                authAt: message.authAt || "",
            }
        },
    })
}
