import { initApiCredentialDataConverter } from "../../../../z_external/converter/apiCredential"

import { combineConverter } from "../../../../z_vendor/getto-application/storage/typed/converter/combine"

import { decodeSuccess, TypedStorageConverter } from "../../../../z_vendor/getto-application/storage/typed/infra"

import { ApiCredential, markApiNonce, markApiRoles } from "../../data"

export function initApiCredentialConverter(): TypedStorageConverter<ApiCredential> {
    return combineConverter(initApiCredentialDataConverter(), {
        toRaw: (value) => value,
        toValue: (raw) =>
            decodeSuccess({ apiNonce: markApiNonce(raw.apiNonce), apiRoles: markApiRoles(raw.apiRoles) }),
    })
}
