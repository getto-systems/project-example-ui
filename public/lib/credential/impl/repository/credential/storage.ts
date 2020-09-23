import { CredentialMessage } from "../../../../y_static/local_storage_pb.js"

import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util"

import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { serializeAuthCredential, initTicketNonce, initApiRoles } from "../../../adapter"

import { AuthCredential } from "../../../data"

export function initStorageAuthCredentialRepository(storage: Storage, key: string): AuthCredentialRepository {
    return new StorageAuthCredentialRepository(new AuthCredentialStorageImpl(storage, key))
}

class StorageAuthCredentialRepository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage
    }

    findTicketNonce(): FindResponse {
        try {
            const authCredential = this.storage.getItem()
            if (!authCredential.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, ticketNonce: authCredential.authCredential.ticketNonce }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        // TODO たふん TicketNonce と ApiCredential を別々に保存するべき
        try {
            this.storage.setItem(authCredential)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

interface AuthCredentialStorage {
    setItem(authCredential: AuthCredential): void
    getItem(): AuthCredentialFound
}

type AuthCredentialFound =
    Readonly<{ found: false }> |
    Readonly<{ found: true, authCredential: AuthCredential }>

class AuthCredentialStorageImpl implements AuthCredentialStorage {
    storage: Storage
    key: string

    constructor(storage: Storage, key: string) {
        this.storage = storage
        this.key = key
    }

    getItem(): AuthCredentialFound {
        const raw = this.storage.getItem(this.key)
        if (raw) {
            try {
                const message = CredentialMessage.decode(decodeBase64StringToUint8Array(raw))

                return {
                    found: true,
                    authCredential: {
                        ticketNonce: initTicketNonce(message.nonce ? message.nonce : ""),
                        apiCredential: {
                            apiRoles: initApiRoles(message.roles ? message.roles : []),
                        },
                    },
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key)
            }
        }

        return { found: false }
    }

    setItem(authCredential: AuthCredential): void {
        const f = CredentialMessage
        const message = new f()

        const data = serializeAuthCredential(authCredential)

        message.nonce = data.ticketNonce
        message.roles = data.apiCredential.apiRoles

        const arr = f.encode(message).finish()
        this.storage.setItem(this.key, encodeUint8ArrayToBase64String(arr))
    }
}
