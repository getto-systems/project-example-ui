import { DB, DBFetchResult, DBTransformer } from "./infra"

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
        return { found: true, value: this.transformer.fromString(value) }
    }
    set(value: T): void {
        this.storage.setItem(this.key, this.transformer.toString(value))
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }
}
