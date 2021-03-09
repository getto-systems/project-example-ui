import { SeasonMessage } from "../y_protobuf/example_pb.js"

import { initDB } from "../base"

import { DB } from "../infra"
import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../z_vendor/base64/transform"

type Season = Readonly<{
    year: number
}>
export function newDB_Season(storage: Storage, key: string): DB<Season> {
    return initDB(storage, key, {
        toString: (value: Season) => {
            const f = SeasonMessage
            const message = new f()

            message.year = value.year

            const arr = f.encode(message).finish()
            return encodeUint8ArrayToBase64String(arr)
        },
        fromString: (value: string) => {
            const message = SeasonMessage.decode(decodeBase64StringToUint8Array(value))
            return {
                year: message.year || 0,
            }
        },
    })
}
