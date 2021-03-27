import { Authz_pb } from "../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initDB } from "../impl"

import { DB } from "../infra"

type Authz = Readonly<{
    roles: string[]
}>
export function newDB_Authz(storage: Storage, key: string): DB<Authz> {
    return initDB(storage, key, {
        toString: (value: Authz) =>
            encodeProtobuf(Authz_pb, (message) => {
                message.roles = value.roles
            }),
        fromString: (raw: string) => decodeProtobuf(Authz_pb, raw),
    })
}
