import { Authn_pb } from "../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Authn = Readonly<{
    authAt: string
}>

type Params = Readonly<{
    database: string
}>
export function newDB_Authn(webDB: IDBFactory, params: Params): DB<Authn> {
    const lastAuth: IndexedDBTarget = {
        store: "authn",
        key: "last",
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [lastAuth.store],
    })
    return {
        get: (): Promise<FetchDBResult<Authn>> => db.get(lastAuth, fromDB),
        set: (value: Authn): Promise<StoreDBResult> => db.set(lastAuth, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(lastAuth),
    }
}

function toDB(value: Authn): string {
    return encodeProtobuf(Authn_pb, (message) => {
        message.authAt = value.authAt
    })
}
function fromDB(raw: string): Authn {
    return decodeProtobuf(Authn_pb, raw)
}
