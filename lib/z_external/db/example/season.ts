import { Season_pb } from "../y_protobuf/example_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initStorage_legacy } from "../helper"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Season = Readonly<{
    year: number
}>
export function newDB_Season(storage: Storage, key: string): DB<Season> {
    const db = initStorage_legacy(storage, key, {
        toString: (value: Season) =>
            encodeProtobuf(Season_pb, (message) => {
                message.year = value.year
            }),
        fromString: (raw: string) => decodeProtobuf(Season_pb, raw),
    })
    return {
        get: async (): Promise<FetchDBResult<Season>> => {
            try {
                return { success: true, ...db.get() }
            } catch (err) {
                return { success: false, err: { type: "infra-error", err: `${err}` } }
            }
        },
        set: async (value): Promise<StoreDBResult> => {
            try {
                db.set(value)
                return { success: true }
            } catch (err) {
                return { success: false, err: { type: "infra-error", err: `${err}` } }
            }
        },
        remove: async (): Promise<StoreDBResult> => {
            try {
                db.remove()
                return { success: true }
            } catch (err) {
                return { success: false, err: { type: "infra-error", err: `${err}` } }
            }
        },
    }
}
