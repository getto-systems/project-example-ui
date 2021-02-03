import { TypedStorage, TypedStorageConverter, TypedStorageFetchResult } from "./infra"

export function initWebTypedStorage<T>(
    storage: Storage,
    key: string,
    converter: TypedStorageConverter<T>
): TypedStorage<T> {
    return new WebStorage(storage, key, converter)
}

class WebStorage<T> {
    storage: Storage
    key: string
    converter: TypedStorageConverter<T>

    constructor(storage: Storage, key: string, converter: TypedStorageConverter<T>) {
        this.storage = storage
        this.key = key
        this.converter = converter
    }

    get(): TypedStorageFetchResult<T> {
        const raw = this.storage.getItem(this.key)
        if (!raw) {
            return { found: false }
        }
        return { found: true, ...this.converter.decode(raw) }
    }
    set(value: T): void {
        this.storage.setItem(this.key, this.converter.encode(value))
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }
}
