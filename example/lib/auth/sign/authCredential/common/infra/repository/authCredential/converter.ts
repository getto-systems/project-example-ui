import { combineConverter } from "../../../../../../../z_infra/storage/converter/combine"
import { initDateConverter } from "../../../../../../../z_infra/storage/converter/date"

import { decodeSuccess, TypedStorageConverter } from "../../../../../../../z_infra/storage/infra"

import { AuthAt, markAuthAt, markTicketNonce, TicketNonce } from "../../../data"

export function initTicketNonceConverter(): TypedStorageConverter<TicketNonce> {
    return {
        toRaw: (value) => value,
        toValue: (raw) => decodeSuccess(markTicketNonce(raw)),
    }
}
export function initLastAuthAtConverter(): TypedStorageConverter<AuthAt> {
    return combineConverter(initDateConverter(), {
        toRaw: (value) => value,
        toValue: (raw) => decodeSuccess(markAuthAt(raw)),
    })
}
