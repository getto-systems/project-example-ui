import { initApiCredentialDataConverter } from "../../../../../z_external/converter/apiCredential"
import { combineConverter } from "../../../../../z_infra/storage/converter/combine"

import { decodeSuccess, TypedStorageConverter } from "../../../../../z_infra/storage/infra"

import { ApiCredential, markApiCredential } from "../../data"

export function initApiCredentialConverter(): TypedStorageConverter<ApiCredential> {
    return combineConverter(initApiCredentialDataConverter(), {
        toRaw: (value) => value,
        toValue: (raw) => decodeSuccess(markApiCredential(raw)),
    })
}