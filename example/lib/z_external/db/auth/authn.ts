import { Authn_pb } from "../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initDB } from "../impl"

import { DB } from "../infra"

type Authn = Readonly<{
    authAt: string
}>
export function newDB_Authn(storage: Storage, key: string): DB<Authn> {
    return initDB(storage, key, {
        toString: (value: Authn) =>
            encodeProtobuf(Authn_pb, (message) => {
                message.authAt = value.authAt
            }),
        fromString: (raw: string) => decodeProtobuf(Authn_pb, raw),
    })
}
