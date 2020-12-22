import { ApiCredentialMessage } from "../../../../../../y_static/local_storage_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../../../../z_external/protocol_buffers_util"

import { StorageKey, AuthCredentialRepository, StoreResult, LoadLastLoginResult } from "../../../infra"

import {
    AuthAt,
    markAuthAt,
    TicketNonce,
    markTicketNonce,
    AuthCredential,
    ApiCredential,
    markApiCredential,
} from "../../../../../common/credential/data"

export function initStorageAuthCredentialRepository(
    storage: Storage,
    key: StorageKey
): AuthCredentialRepository {
    return new Repository(storage, key)
}

class Repository implements AuthCredentialRepository {
    ticketNonce: TicketNonceStorage
    apiCredential: ApiCredentialStorage
    authAt: AuthAtStorage

    constructor(storage: Storage, key: StorageKey) {
        this.ticketNonce = new TicketNonceStorage(storage, key.ticketNonce)
        this.apiCredential = new ApiCredentialStorage(storage, key.apiCredential)
        this.authAt = new AuthAtStorage(storage, key.lastAuthAt)
    }

    findLastLogin(): LoadLastLoginResult {
        try {
            const ticketNonce = this.ticketNonce.get()
            if (!ticketNonce.found) {
                return { success: true, found: false }
            }

            const authAt = this.authAt.get()
            if (!authAt.found) {
                return { success: true, found: false }
            }

            return {
                success: true,
                found: true,
                lastLogin: {
                    ticketNonce: ticketNonce.content,
                    lastAuthAt: authAt.content,
                },
            }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResult {
        try {
            this.ticketNonce.set(authCredential.ticketNonce)
            this.apiCredential.set(authCredential.apiCredential)
            this.authAt.set(authCredential.authAt)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
    removeAuthCredential(): StoreResult {
        try {
            this.ticketNonce.remove()
            this.apiCredential.remove()
            this.authAt.remove()
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

class CredentialStorage<T> {
    storage: Storage
    key: string
    encoder: Encoder<T>

    constructor(storage: Storage, key: string, encoder: Encoder<T>) {
        this.storage = storage
        this.key = key
        this.encoder = encoder
    }

    get(): Found<T> {
        const raw = this.storage.getItem(this.key)
        if (!raw) {
            return { found: false }
        }
        try {
            return { found: true, content: this.encoder.decode(raw) }
        } catch (err) {
            // デコードに失敗したらストレージから削除
            console.error(err)
            this.remove()
            return { found: false }
        }
    }
    set(value: T): void {
        this.storage.setItem(this.key, this.encoder.encode(value))
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }
}

interface Encoder<T> {
    encode(value: T): string
    decode(raw: string): T
}

class TicketNonceStorage extends CredentialStorage<TicketNonce> {
    constructor(storage: Storage, key: string) {
        super(storage, key, {
            encode(value: TicketNonce): string {
                return value
            },
            decode(raw: string): TicketNonce {
                return markTicketNonce(raw)
            },
        })
    }
}
class ApiCredentialStorage extends CredentialStorage<ApiCredential> {
    constructor(storage: Storage, key: string) {
        super(storage, key, {
            encode(value: ApiCredential): string {
                const f = ApiCredentialMessage
                const message = new f()

                // TODO api nonce を追加
                //message.nonce = value.apiNonce
                message.roles = value.apiRoles

                const arr = f.encode(message).finish()
                return encodeUint8ArrayToBase64String(arr)
            },
            decode(raw: string): ApiCredential {
                const message = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(raw))
                return markApiCredential({
                    apiRoles: message.roles ? message.roles : [],
                })
            },
        })
    }
}
class AuthAtStorage extends CredentialStorage<AuthAt> {
    constructor(storage: Storage, key: string) {
        super(storage, key, {
            encode(value: AuthAt): string {
                return value.toISOString()
            },
            decode(raw: string): AuthAt {
                return markAuthAt(new Date(raw))
            },
        })
    }
}

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; content: T }>
