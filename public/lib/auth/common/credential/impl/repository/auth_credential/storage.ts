import { ApiCredentialMessage } from "../../../../../../y_static/local_storage_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../../../../z_external/protocol_buffers_util"

import { StorageKey, AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import {
    LoginAt,
    markLoginAt,
    TicketNonce,
    markTicketNonce,
    AuthCredential,
    ApiCredential,
    markApiCredential,
} from "../../../data"

export function initStorageAuthCredentialRepository(
    storage: Storage,
    key: StorageKey
): AuthCredentialRepository {
    return new Repository(storage, key)
}

class Repository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: Storage, key: StorageKey) {
        this.storage = new AuthCredentialStorageImpl(storage, key)
    }

    findTicketNonce(): FindResponse<TicketNonce> {
        try {
            const found = this.storage.getTicketNonce()
            if (!found.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, content: found.content }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    findLastLoginAt(): FindResponse<LoginAt> {
        try {
            const found = this.storage.getLastLoginAt()
            if (!found.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, content: found.content }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        try {
            this.storage.setTicketNonce(authCredential.ticketNonce)
            this.storage.setApiCredential(authCredential.apiCredential)
            this.storage.setLastLoginAt(authCredential.loginAt)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
    removeAuthCredential(): StoreResponse {
        try {
            this.storage.removeTicketNonce()
            this.storage.removeApiCredential()
            this.storage.removeLastLoginAt()
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

interface AuthCredentialStorage {
    getTicketNonce(): Found<TicketNonce>
    setTicketNonce(ticketNonce: TicketNonce): void
    removeTicketNonce(): void

    getApiCredential(): Found<ApiCredential>
    setApiCredential(apiCredential: ApiCredential): void
    removeApiCredential(): void

    getLastLoginAt(): Found<LoginAt>
    setLastLoginAt(loginAt: LoginAt): void
    removeLastLoginAt(): void
}

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; content: T }>

class AuthCredentialStorageImpl implements AuthCredentialStorage {
    storage: Storage
    key: StorageKey

    constructor(storage: Storage, key: StorageKey) {
        this.storage = storage
        this.key = key
    }

    getTicketNonce(): Found<TicketNonce> {
        const raw = this.storage.getItem(this.key.ticketNonce)
        if (raw) {
            return { found: true, content: markTicketNonce(raw) }
        }

        return { found: false }
    }
    setTicketNonce(ticketNonce: TicketNonce): void {
        this.storage.setItem(this.key.ticketNonce, ticketNonce)
    }
    removeTicketNonce(): void {
        this.storage.removeItem(this.key.ticketNonce)
    }

    getApiCredential(): Found<ApiCredential> {
        const raw = this.storage.getItem(this.key.apiCredential)
        if (raw) {
            try {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))

                return {
                    found: true,
                    content: markApiCredential({
                        apiRoles: message.roles ? message.roles : [],
                    }),
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key.apiCredential)
            }
        }

        return { found: false }
    }
    setApiCredential(apiCredential: ApiCredential): void {
        const f = ApiCredentialMessage
        const message = new f()

        // TODO api nonce を追加
        //message.nonce = data.apiNonce
        message.roles = apiCredential.apiRoles

        const arr = f.encode(message).finish()
        this.storage.setItem(this.key.apiCredential, encodeUint8ArrayToBase64String(arr))
    }
    removeApiCredential(): void {
        this.storage.removeItem(this.key.apiCredential)
    }

    getLastLoginAt(): Found<LoginAt> {
        const raw = this.storage.getItem(this.key.lastLoginAt)
        if (raw) {
            return { found: true, content: markLoginAt(new Date(raw)) }
        }
        return { found: false }
    }
    setLastLoginAt(loginAt: LoginAt): void {
        this.storage.setItem(this.key.lastLoginAt, loginAt.toISOString())
    }
    removeLastLoginAt(): void {
        this.storage.removeItem(this.key.lastLoginAt)
    }
}
