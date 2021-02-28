import { combineConverter } from "../../../../../../../../z_vendor/getto-application/infra/storage/typed/converter/combine"
import { initDateConverter } from "../../../../../../../../z_vendor/getto-application/infra/storage/typed/converter/date"

import {
    decodeSuccess,
    TypedStorageConverter,
} from "../../../../../../../../z_vendor/getto-application/infra/storage/typed/infra"

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
