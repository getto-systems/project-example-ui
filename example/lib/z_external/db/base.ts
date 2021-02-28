import { DB, DBFetchResult, DBStoreResult, DBTransformer } from "./infra"

export function initDB<T>(storage: Storage, key: string, transformer: DBTransformer<T>): DB<T> {
    return new Impl(storage, key, transformer)
}

class Impl<T> implements DB<T> {
    readonly storage: Storage
    readonly key: string

    readonly transformer: DBTransformer<T>

    constructor(storage: Storage, key: string, transformer: DBTransformer<T>) {
        this.storage = storage
        this.key = key
        this.transformer = transformer
    }

    get(): DBFetchResult<T> {
        const value = this.storage.getItem(this.key)
        if (!value) {
            return { found: false }
        }
        return { found: true, result: this.transformer.fromString(value) }
    }
    set(value: T): DBStoreResult {
        const result = this.transformer.toString(value)
        if (!result.success) {
            return result
        }
        this.storage.setItem(this.key, result.value)
        return { success: true }
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }
}
