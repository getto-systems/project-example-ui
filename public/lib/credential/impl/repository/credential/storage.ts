import { ApiCredentialMessage } from "../../../../y_static/local_storage_pb.js"

import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util"

import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { initTicketNonce, initApiRoles, ticketNonceToString, serializeApiCredential } from "../../../adapter"

import { AuthCredential, TicketNonce, ApiCredential } from "../../../data"

export function initStorageAuthCredentialRepository(storage: Storage): AuthCredentialRepository {
    return new Repository(storage)
}

class Repository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: Storage) {
        this.storage = new AuthCredentialStorageImpl(storage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
        })
    }

    findTicketNonce(): FindResponse {
        try {
            const found = this.storage.getTicketNonce()
            if (!found.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, ticketNonce: found.content }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        try {
            this.storage.setTicketNonce(authCredential.ticketNonce)
            this.storage.setApiCredential(authCredential.apiCredential)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

interface AuthCredentialStorage {
    setTicketNonce(ticketNonce: TicketNonce): void
    getTicketNonce(): Found<TicketNonce>

    setApiCredential(apiCredential: ApiCredential): void
    getApiCredential(): Found<ApiCredential>
}

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>

type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
}>

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
            return { found: true, content: initTicketNonce(raw) }
        }

        return { found: false }
    }

    setTicketNonce(ticketNonce: TicketNonce): void {
        this.storage.setItem(this.key.ticketNonce, ticketNonceToString(ticketNonce))
    }

    getApiCredential(): Found<ApiCredential> {
        const raw = this.storage.getItem(this.key.apiCredential)
        if (raw) {
            try {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))

                return {
                    found: true,
                    content: {
                        apiRoles: initApiRoles(message.roles ? message.roles : []),
                    },
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

        const data = serializeApiCredential(apiCredential)

        // TODO api nonce を追加
        //message.nonce = data.apiNonce
        message.roles = data.apiRoles

        const arr = f.encode(message).finish()
        this.storage.setItem(this.key.apiCredential, encodeUint8ArrayToBase64String(arr))
    }
}
