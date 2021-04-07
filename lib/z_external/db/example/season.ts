import { Season_pb } from "../y_protobuf/example_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, DBConverter, FetchDBResult, StoreDBResult } from "../infra"

type Season = Readonly<{
    year: number
}>

const CURRENT_SEASON: IndexedDBTarget = {
    store: "season",
    key: "current",
}

export function newDB_Season(webDB: IDBFactory, database: string): DB<Season> {
    const db = initIndexedDB(webDB, {
        database,
        stores: [CURRENT_SEASON.store],
    })
    return {
        get: (): Promise<FetchDBResult<Season>> => {
            return db.get(CURRENT_SEASON, seasonConverter.fromDB)
        },
        set: (value: Season): Promise<StoreDBResult> => {
            return db.set(CURRENT_SEASON, seasonConverter.toDB, value)
        },
        remove: (): Promise<StoreDBResult> => {
            return db.remove(CURRENT_SEASON)
        },
    }
}

const seasonConverter: DBConverter<Season> = {
    toDB: (value: Season) =>
        encodeProtobuf(Season_pb, (message) => {
            message.year = value.year
        }),
    fromDB: (raw: string) => decodeProtobuf(Season_pb, raw),
}
