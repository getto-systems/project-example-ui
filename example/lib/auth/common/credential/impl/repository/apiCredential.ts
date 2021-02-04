import { TypedStorage } from "../../../../../z_infra/storage/infra"
import { ApiCredentialRepository } from "../../infra"

import {
    ApiCredential,
    ApiNonce,
    ApiRoles,
    LoadApiCredentialResult,
    markApiNonce,
    markApiRoles,
} from "../../data"

export type ApiCredentialStorage = Readonly<{
    apiCredential: TypedStorage<ApiCredential>
}>
export function initApiCredentialRepository(storage: ApiCredentialStorage): ApiCredentialRepository {
    return new Repository(storage)
}

class Repository implements ApiCredentialRepository {
    storage: ApiCredentialStorage

    constructor(storage: ApiCredentialStorage) {
        this.storage = storage
    }

    findApiNonce(): LoadApiCredentialResult<ApiNonce> {
        // TODO 適切な ApiNonce を return するように
        return loadApiCredential(this.storage.apiCredential, (_apiCredential) =>
            markApiNonce("api-nonce")
        )
    }
    findApiRoles(): LoadApiCredentialResult<ApiRoles> {
        return loadApiCredential(this.storage.apiCredential, (apiCredential) =>
            markApiRoles(apiCredential.apiRoles)
        )
    }
}

function loadApiCredential<T>(
    storage: TypedStorage<ApiCredential>,
    getter: { (apiCredential: ApiCredential): T }
): LoadApiCredentialResult<T> {
    try {
        const result = storage.get()
        if (!result.found) {
            return { success: true, found: false }
        }
        if (result.decodeError) {
            // デコードに失敗するなら削除
            storage.remove()
            return { success: true, found: false }
        }
        return { success: true, found: true, content: getter(result.value) }
    } catch (err) {
        return { success: false, err: { type: "infra-error", err: `${err}` } }
    }
}
