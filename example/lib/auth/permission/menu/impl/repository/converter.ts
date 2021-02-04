import { TypedStorageConverter } from "../../../../../z_infra/storage/infra"
import { MenuExpand } from "../../infra"

export function initMenuExpandConverter(): TypedStorageConverter<MenuExpand> {
    return {
        encode: (value) => JSON.stringify(value),
        decode: (raw) => {
            const json = JSON.parse(raw)
            if (!(json instanceof Array)) {
                return { decodeError: true, err: `decode menu expand error: not array : ${raw}` }
            }
            if (
                !json.every(
                    (value) => value instanceof Array && value.every((val) => typeof val === "string")
                )
            ) {
                return {
                    decodeError: true,
                    err: `decode menu expand error: entry is not string array : ${raw}`,
                }
            }
            return { decodeError: false, value: json }
        },
    }
}
