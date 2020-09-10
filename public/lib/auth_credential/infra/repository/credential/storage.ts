import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util";
import { CredentialMessage } from "../../../../y_static/local_storage_pb.js";

import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra";

import { AuthCredential, TicketNonce } from "../../../data";

export function initStorageAuthCredentialRepository(storage: Storage, key: string): AuthCredentialRepository {
    return new StorageAuthCredentialRepository(new AuthCredentialStorageImpl(storage, key));
}

class StorageAuthCredentialRepository implements AuthCredentialRepository {
    storage: AuthCredentialStorage;

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage;
    }

    findTicketNonce(): FindResponse<TicketNonce> {
        try {
            const authCredential = this.storage.getItem();
            if (!authCredential.found) {
                return { success: true, found: false };
            }

            return { success: true, found: true, content: authCredential.authCredential.ticketNonce };
        } catch (err) {
            return { success: false, err: { type: "infra-error", err } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        try {
            this.storage.setItem(authCredential);
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err } }
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
    storage: Storage;
    key: string;

    constructor(storage: Storage, key: string) {
        this.storage = storage;
        this.key = key;
    }

    getItem(): AuthCredentialFound {
        const raw = this.storage.getItem(this.key);
        if (raw) {
            try {
                const message = CredentialMessage.decode(decodeBase64StringToUint8Array(raw));

                return {
                    found: true,
                    authCredential: {
                        ticketNonce: { ticketNonce: message.nonce ? message.nonce : "" },
                        apiCredential: {
                            apiRoles: { apiRoles: message.roles ? message.roles : [] },
                        },
                    },
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key);
            }
        }

        return { found: false }
    }

    setItem(authCredential: AuthCredential): void {
        const f = CredentialMessage;
        const message = new f();

        message.nonce = authCredential.ticketNonce.ticketNonce;
        message.roles = Array.from(authCredential.apiCredential.apiRoles.apiRoles);

        const arr = f.encode(message).finish();
        this.storage.setItem(this.key, encodeUint8ArrayToBase64String(arr));
    }
}
