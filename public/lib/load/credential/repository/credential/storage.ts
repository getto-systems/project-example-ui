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

type Data =
    Readonly<{ nonce: NonceValue, roles: ApiRoles }> |
    Readonly<{ nonce: NonceValue }> |
    Readonly<{ roles: ApiRoles }>

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
                    }

                case "roles":
                    return {
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
                const data = JSON.parse(raw);
                if (!data.roles) {
                    throw "parse error";
                }

                const roles = parseApiRoles(data.roles);

                if (data.nonce) {
                    return {
                        found: true,
                        nonce: nonce(data.nonce),
                        roles: roles,
                    }
                } else {
                    return {
                        found: true,
                        nonce: nonceNotFound,
                        roles: roles,
                    }
                }
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                this.storage.removeItem(this.key);
            }
        }

        return { found: false }
    }

    setItem(data: Data): Success {
        this.storage.setItem(this.key, JSON.stringify(data));
        return success;
    }
}

function parseApiRoles(roles: unknown): ApiRoles {
    if (!(roles instanceof Array)) {
        throw "parse error";
    }

    const parsedRoles: Array<string> = [];
    roles.forEach((val: unknown) => {
        if (typeof val !== "string") {
            throw "parse error";
        }
        parsedRoles.push(val);
    });

    return parsedRoles;
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
