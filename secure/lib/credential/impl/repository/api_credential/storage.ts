import { ApiCredentialMessage } from "../../../../y_static/local_storage_pb.js"

import { decodeBase64StringToUint8Array } from "../../../../z_external/protocol_buffers_util"

import {
    StorageKey,
    ApiCredentialRepository, FindResponse,
} from "../../../infra"

import {
    packApiRoles,
} from "../../../../credential/adapter"

import { ApiCredential } from "../../../../credential/data"

export function initStorageApiCredentialRepository(storage: Storage, key: StorageKey): ApiCredentialRepository {
    return new Repository(storage, key)
}

class Repository implements ApiCredentialRepository {
    storage: ApiCredentialStorage

    constructor(storage: Storage, key: StorageKey) {
        this.storage = new ApiCredentialStorageImpl(storage, key)
    }

    findApiCredential(): FindResponse<ApiCredential> {
        try {
            const found = this.storage.getApiCredential()
            if (!found.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, content: found.content }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

interface ApiCredentialStorage {
    getApiCredential(): Found<ApiCredential>
}

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>

class ApiCredentialStorageImpl implements ApiCredentialStorage {
    storage: Storage
    key: StorageKey

    constructor(storage: Storage, key: StorageKey) {
        this.storage = storage
        this.key = key
    }

    getApiCredential(): Found<ApiCredential> {
        const raw = this.storage.getItem(this.key.apiCredential)
        if (raw) {
            try {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))

                return {
                    found: true,
                    content: {
                        apiRoles: packApiRoles(message.roles ? message.roles : []),
                    },
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key.apiCredential)
            }
        }

        return { found: false }
    }
}
