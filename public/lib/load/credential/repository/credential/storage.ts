import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../../../z_external/protocol_buffers_util";
import { CredentialMessage } from "../../../../y_static/local_storage_pb.js";

import { Nonce, nonce, nonceNotFound, NonceValue, ApiRoles } from "../../data";
import { CredentialRepository, Success, success } from "../../infra";

export function initStorageCredential(storage: Storage, key: string): CredentialRepository {
    return new Repository(new CredentialStorageImpl(storage, key));
}

interface CredentialStorage {
    setItem(data: Data): Success;
    getItem(): Credential;
}

type Credential =
    Readonly<{ found: false }> |
    Readonly<{
        found: true,
        nonce: Nonce,
        roles: ApiRoles,
    }>

type Data = Readonly<{ nonce: NonceValue, roles: ApiRoles }>

type Update =
    Readonly<{ type: "nonce", nonce: NonceValue }> |
    Readonly<{ type: "roles", roles: ApiRoles }>

class Repository implements CredentialRepository {
    storage: CredentialStorage;

    constructor(storage: CredentialStorage) {
        this.storage = storage;
    }

    async findNonce(): Promise<Nonce> {
        const credential = this.storage.getItem();
        if (!credential.found) {
            return nonceNotFound;
        }

        return credential.nonce;
    }

    async storeRoles(roles: ApiRoles): Promise<Success> {
        return this.storage.setItem(this.newCredential({ type: "roles", roles: roles }));
    }

    async storeNonce(value: NonceValue): Promise<Success> {
        return this.storage.setItem(this.newCredential({ type: "nonce", nonce: value }));
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
                            nonce: "",
                            roles: data.roles,
                        }
                    }

                default:
                    return assertNever(data);
            }
        } else {
            switch (data.type) {
                case "nonce":
                    return {
                        nonce: data.nonce,
                        roles: [],
                    }

                case "roles":
                    return {
                        nonce: "",
                        roles: data.roles,
                    }

                default:
                    return assertNever(data);
            }
        }
    }
}

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
                    nonce: credential.nonce ? nonce(credential.nonce) : nonceNotFound,
                    roles: credential.roles ? credential.roles : [],
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key);
            }
        }

        return { found: false }
    }

    setItem(data: Data): Success {
        const f = CredentialMessage;
        const credential = new f();

        credential.nonce = data.nonce;
        credential.roles = Array.from(data.roles);

        const arr = f.encode(credential).finish();
        this.storage.setItem(this.key, encodeUint8ArrayToBase64String(arr));

        return success;
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
