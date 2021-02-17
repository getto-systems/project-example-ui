import { combineConverter } from "../../../../../../../../z_infra/storage/converter/combine"
import { initDateConverter } from "../../../../../../../../z_infra/storage/converter/date"

import {
    decodeSuccess,
    TypedStorageConverter,
} from "../../../../../../../../z_infra/storage/infra"

import { AuthAt, markAuthAt, markAuthnNonce, AuthnNonce } from "../../../data"

export function initAuthnNonceConverter(): TypedStorageConverter<AuthnNonce> {
    return {
        toRaw: (value) => value,
        toValue: (raw) => decodeSuccess(markAuthnNonce(raw)),
    }
}
export function initLastAuthAtConverter(): TypedStorageConverter<AuthAt> {
    return combineConverter(initDateConverter(), {
        toRaw: (value) => value,
        toValue: (raw) => decodeSuccess(markAuthAt(raw)),
    })
}
