import { MenuExpand_pb } from "../y_protobuf/outline_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Expand = string[][]

type Params = Readonly<{
    database: string
    key: string
}>
export function newDB_MenuExpand(webDB: IDBFactory, params: Params): DB<Expand> {
    const menu_expand: IndexedDBTarget = {
        store: "menu-expand",
        key: params.key,
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [menu_expand.store],
    })
    return {
        get: (): Promise<FetchDBResult<Expand>> => db.get(menu_expand, fromDB),
        set: (value: Expand): Promise<StoreDBResult> => db.set(menu_expand, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(menu_expand),
    }
}

function toDB(value: Expand): string {
    return encodeProtobuf(MenuExpand_pb, (message) => {
        message.paths = value.map((labels) => {
            const message = new MenuExpand_pb.Path()
            message.labels = labels
            return message
        })
    })
}
function fromDB(raw: string): Expand {
    return decodeProtobuf(MenuExpand_pb, raw).paths.map((path) => path.labels || [])
}
