import { MenuExpandMessage } from "../y_protobuf/outline_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../z_vendor/base64/transform"

import { initDB } from "../base"

import { DB } from "../../../z_vendor/getto-application/infra/repository/infra"

type Expand = string[][]
export function newDB_MenuExpand(storage: Storage, key: string): DB<Expand> {
    return initDB(storage, key, {
        toString: (value: Expand) => {
            const f = MenuExpandMessage
            const message = new f()

            message.paths = value.map((labels) => {
                const f = MenuExpandMessage.Path
                const message = new f()

                message.labels = labels

                return message
            })

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        fromString: (value: string) => {
            const message = MenuExpandMessage.decode(decodeBase64StringToUint8Array(value))
            return (message.paths || []).map((path) => path.labels || [])
        },
    })
}
