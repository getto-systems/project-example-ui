import { Authn_pb } from "../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initStorage_legacy } from "../helper"

import { DB_legacy } from "../infra"

type Authn = Readonly<{
    authAt: string
}>
export function newDB_Authn(storage: Storage, key: string): DB_legacy<Authn> {
    return initStorage_legacy(storage, key, {
        toString: (value: Authn) =>
            encodeProtobuf(Authn_pb, (message) => {
                message.authAt = value.authAt
            }),
        fromString: (raw: string) => decodeProtobuf(Authn_pb, raw),
    })
}
