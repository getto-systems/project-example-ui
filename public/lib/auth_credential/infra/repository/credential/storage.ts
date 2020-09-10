import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util";
import { CredentialMessage } from "../../../../y_static/local_storage_pb.js";

import { AuthCredentialRepository, TicketNonceFound, ticketNonceFound, ticketNonceNotFound } from "../../../infra";

import { AuthCredential } from "../../../data";

export function initStorageAuthCredentialRepository(storage: Storage, key: string): AuthCredentialRepository {
    return new StorageAuthCredentialRepository(new AuthCredentialStorageImpl(storage, key));
}

class StorageAuthCredentialRepository implements AuthCredentialRepository {
    storage: AuthCredentialStorage;

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage;
    }

    async findTicketNonce(): Promise<TicketNonceFound> {
        const authCredential = this.storage.getItem();
        if (!authCredential.found) {
            return ticketNonceNotFound;
        }

        return ticketNonceFound(authCredential.authCredential.ticketNonce);
    }

    async storeAuthCredential(authCredential: AuthCredential): Promise<void> {
        this.storage.setItem(authCredential);
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
