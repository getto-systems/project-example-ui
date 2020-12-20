import { ApiCredentialMessage } from "../../../../../../y_static/local_storage_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../../../../../z_external/protocol_buffers_util"

import { StorageKey, AuthCredentialRepository } from "../../../infra"

import {
    LoginAt,
    markLoginAt,
    TicketNonce,
    markTicketNonce,
    AuthCredential,
    ApiCredential,
    markApiCredential,
    StoreResult,
    LoadLastLoginResult,
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
    loginAt: LoginAtStorage

    constructor(storage: Storage, key: StorageKey) {
        this.ticketNonce = new TicketNonceStorage(storage, key.ticketNonce)
        this.apiCredential = new ApiCredentialStorage(storage, key.apiCredential)
        this.loginAt = new LoginAtStorage(storage, key.lastLoginAt)
    }

    findLastLogin(): LoadLastLoginResult {
        try {
            const ticketNonce = this.ticketNonce.get()
            if (!ticketNonce.found) {
                return { success: true, found: false }
            }

            const loginAt = this.loginAt.get()
            if (!loginAt.found) {
                return { success: true, found: false }
            }

            return {
                success: true,
                found: true,
                lastLogin: {
                    ticketNonce: ticketNonce.content,
                    lastLoginAt: loginAt.content,
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
            this.loginAt.set(authCredential.loginAt)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
    removeAuthCredential(): StoreResult {
        try {
            this.ticketNonce.remove()
            this.apiCredential.remove()
            this.loginAt.remove()
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
class LoginAtStorage extends CredentialStorage<LoginAt> {
    constructor(storage: Storage, key: string) {
        super(storage, key, {
            encode(value: LoginAt): string {
                return value.toISOString()
            },
            decode(raw: string): LoginAt {
                return markLoginAt(new Date(raw))
            },
        })
    }
}

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; content: T }>
