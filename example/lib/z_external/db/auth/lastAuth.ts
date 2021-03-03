import { LastAuthMessage } from "../y_protobuf/auth_pb.js"

import { initDB } from "../base"

import { DB } from "../infra"
import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../z_vendor/base64/transform"

type LastAuth = Readonly<{
    nonce: string
    lastAuthAt: string
}>
export function newDB_LastAuth(storage: Storage, key: string): DB<LastAuth> {
    return initDB(storage, key, {
        toString: (value: LastAuth) => {
            const f = LastAuthMessage
            const message = new f()

            message.nonce = value.nonce
            message.lastAuthAt = value.lastAuthAt

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        fromString: (raw: string) => {
            const message = LastAuthMessage.decode(decodeBase64StringToUint8Array(raw))
            return {
                nonce: message.nonce || "",
                lastAuthAt: message.lastAuthAt || "",
            }
        },
    })
}
