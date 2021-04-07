import { Season_pb } from "../y_protobuf/example_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Season = Readonly<{
    year: number
}>

type Params = Readonly<{
    database: string
}>
export function newDB_Season(webDB: IDBFactory, params: Params): DB<Season> {
    const current_season: IndexedDBTarget = {
        store: "season",
        key: "current",
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [current_season.store],
    })
    return {
        get: (): Promise<FetchDBResult<Season>> => db.get(current_season, fromDB),
        set: (value: Season): Promise<StoreDBResult> => db.set(current_season, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(current_season),
    }
}

function toDB(value: Season): string {
    return encodeProtobuf(Season_pb, (message) => {
        message.year = value.year
    })
}
function fromDB(raw: string): Season {
    return decodeProtobuf(Season_pb, raw)
}
