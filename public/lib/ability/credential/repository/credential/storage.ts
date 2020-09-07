import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util";
import { CredentialMessage } from "../../../../y_static/local_storage_pb.js";

import { CredentialRepository, TicketNonceFound, ticketNonceFound, ticketNonceNotFound } from "../../infra";

import { TicketNonce, ApiRoles } from "../../data";

export function initStorageCredentialRepository(storage: Storage, key: string): CredentialRepository {
    return new StorageCredentialRepository(new CredentialStorageImpl(storage, key));
}

class StorageCredentialRepository implements CredentialRepository {
    storage: CredentialStorage;

    constructor(storage: CredentialStorage) {
        this.storage = storage;
    }

    async findNonce(): Promise<TicketNonceFound> {
        const credential = this.storage.getItem();
        if (!credential.found) {
            return ticketNonceNotFound;
        }

        return credential.nonce;
    }

    async storeRoles(roles: ApiRoles): Promise<void> {
        this.storage.setItem(this.newCredential({ type: "roles", roles: roles }));
    }

    async storeNonce(value: TicketNonce): Promise<void> {
        this.storage.setItem(this.newCredential({ type: "nonce", nonce: value }));
    }

    newCredential(data: Update): Data {
        const credential = this.storage.getItem();
        if (credential.found) {
            switch (data.type) {
                case "nonce":
                    return {
                        nonce: data.nonce,
                        roles: credential.roles,
                    }

                case "roles":
                    if (credential.nonce.found) {
                        return {
                            nonce: credential.nonce.value,
                            roles: data.roles,
                        }
                    } else {
                        return {
                            nonce: { nonce: "" },
                            roles: data.roles,
                        }
                    }
            }
        } else {
            switch (data.type) {
                case "nonce":
                    return {
                        nonce: data.nonce,
                        roles: { roles: [] },
                    }

                case "roles":
                    return {
                        nonce: { nonce: "" },
                        roles: data.roles,
                    }
            }
        }
    }
}

interface CredentialStorage {
    setItem(data: Data): void;
    getItem(): Credential;
}

type Credential =
    Readonly<{ found: false }> |
    Readonly<{
        found: true,
        nonce: TicketNonceFound,
        roles: ApiRoles,
    }>

type Data = Readonly<{ nonce: TicketNonce, roles: ApiRoles }>

type Update =
    Readonly<{ type: "nonce", nonce: TicketNonce }> |
    Readonly<{ type: "roles", roles: ApiRoles }>

class CredentialStorageImpl implements CredentialStorage {
    storage: Storage;
    key: string;

    constructor(storage: Storage, key: string) {
        this.storage = storage;
        this.key = key;
    }

    getItem(): Credential {
        const raw = this.storage.getItem(this.key);
        if (raw) {
            try {
                const credential = CredentialMessage.decode(decodeBase64StringToUint8Array(raw));

                return {
                    found: true,
                    nonce: credential.nonce ? ticketNonceFound({ nonce: credential.nonce }) : ticketNonceNotFound,
                    roles: { roles: credential.roles ? credential.roles : [] },
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key);
            }
        }

        return { found: false }
    }

    setItem(data: Data): void {
        const f = CredentialMessage;
        const credential = new f();

        credential.nonce = data.nonce.nonce;
        credential.roles = Array.from(data.roles.roles);

        const arr = f.encode(credential).finish();
        this.storage.setItem(this.key, encodeUint8ArrayToBase64String(arr));
    }
}
