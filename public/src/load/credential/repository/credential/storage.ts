import { Nonce, nonce, nonceNotFound, NonceValue, ApiRoles, apiRoles } from "../../data";
import { CredentialRepository, Success, success } from "../../infra";

export function initStorageCredential(storage: Storage, key: string): CredentialRepository {
    return {
        async findNonce(): Promise<Nonce> {
            const store = getStore();
            if (!store.found) {
                return nonceNotFound;
            }

            return store.data.nonce;
        },
        async storeRoles(roles: ApiRoles): Promise<Success> {
            const store = getStore();
            if (store.found && store.data.nonce.found) {
                storage.setItem(key, JSON.stringify({
                    nonce: store.data.nonce.value,
                    roles: roles,
                }));
            } else {
                storage.setItem(key, JSON.stringify({
                    roles: roles,
                }));
            }
            return success;
        },
        async storeNonce(value: NonceValue): Promise<Success> {
            const store = getStore();
            if (store.found) {
                storage.setItem(key, JSON.stringify({
                    nonce: value,
                    roles: store.data.roles,
                }));
            } else {
                storage.setItem(key, JSON.stringify({
                    nonce: value,
                    roles: apiRoles([]),
                }));
            }
            return success;
        },
    }

    type Store =
        Readonly<{ found: false }> |
        Readonly<{ found: true, data: Data }>

    type Data = Readonly<{
        nonce: Nonce,
        roles: ApiRoles,
    }>

    function getStore(): Store {
        const raw = storage.getItem(key);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                if (data.nonce && data.roles) {
                    return {
                        found: true,
                        data: {
                            nonce: nonce(data.nonce),
                            roles: apiRoles(data.roles),
                        },
                    }
                }
                if (data.roles) {
                    return {
                        found: true,
                        data: {
                            nonce: nonceNotFound,
                            roles: apiRoles(data.roles),
                        },
                    }
                }

                // 必須のキーがないデータの場合はキーを削除する
                storage.removeItem(key);
            } catch (err) {
                // パースできないデータの場合はキーを削除する
                storage.removeItem(key);
            }
        }

        return { found: false }
    }
}
