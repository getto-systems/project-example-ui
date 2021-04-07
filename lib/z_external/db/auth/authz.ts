import { Authz_pb } from "../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"

import { DB, FetchDBResult, StoreDBResult } from "../infra"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

type Authz = Readonly<{
    roles: string[]
}>

type Params = Readonly<{
    database: string
}>
export function newDB_Authz(webDB: IDBFactory, params: Params): DB<Authz> {
    const lastAuth: IndexedDBTarget = {
        store: "authz",
        key: "last",
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [lastAuth.store],
    })
    return {
        get: (): Promise<FetchDBResult<Authz>> => db.get(lastAuth, fromDB),
        set: (value: Authz): Promise<StoreDBResult> => db.set(lastAuth, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(lastAuth),
    }
}

function toDB(value: Authz): string {
    return encodeProtobuf(Authz_pb, (message) => {
        message.roles = value.roles
    })
}
function fromDB(raw: string): Authz {
    return decodeProtobuf(Authz_pb, raw)
}
