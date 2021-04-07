import { MenuExpand_pb } from "../y_protobuf/outline_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initStorage_legacy } from "../helper"

import { DB_legacy } from "../../../z_vendor/getto-application/infra/repository/infra"

type Expand = string[][]
export function newDB_MenuExpand(storage: Storage, key: string): DB_legacy<Expand> {
    return initStorage_legacy(storage, key, {
        toString: (value: Expand) =>
            encodeProtobuf(MenuExpand_pb, (message) => {
                message.paths = value.map((labels) => {
                    const message = new MenuExpand_pb.Path()
                    message.labels = labels
                    return message
                })
            }),
        fromString: (raw: string) =>
            decodeProtobuf(MenuExpand_pb, raw).paths.map((path) => path.labels || []),
    })
}
