import { TypedStorageConverter } from "../../../../../../../z_vendor/getto-application/storage/typed/infra"
import { OutlineMenuExpand } from "../../../infra"

export function initOutlineMenuExpandConverter(): TypedStorageConverter<OutlineMenuExpand> {
    return {
        toRaw: (value) => JSON.stringify(value),
        toValue: (raw) => {
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
