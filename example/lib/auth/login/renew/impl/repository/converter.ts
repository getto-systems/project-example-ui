import { initApiCredentialDataConverter } from "../../../../../z_external/converter/apiCredential"

import { combineConverter } from "../../../../../z_infra/storage/converter/combine"
import { initDateConverter } from "../../../../../z_infra/storage/converter/date"
import { decodeSuccess, TypedStorageConverter } from "../../../../../z_infra/storage/infra"

import {
    ApiCredential,
    AuthAt,
    markApiCredential,
    markAuthAt,
    markTicketNonce,
    TicketNonce,
} from "../../../../common/credential/data"

export function initTicketNonceConverter(): TypedStorageConverter<TicketNonce> {
    return {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markTicketNonce(value)),
    }
}
export function initApiCredentialConverter(): TypedStorageConverter<ApiCredential> {
    return combineConverter(initApiCredentialDataConverter(), {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markApiCredential(value)),
    })
}
export function initLastAuthAtConverter(): TypedStorageConverter<AuthAt> {
    return combineConverter(initDateConverter(), {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markAuthAt(value)),
    })
}
