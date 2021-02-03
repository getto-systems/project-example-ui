import { TypedStorage, TypedStorageFetchResult } from "./infra"

export type MemoryTypedStorageStore<T> = Readonly<{ set: false }> | Readonly<{ set: true; value: T }>

export function initMemoryTypedStorage<T>(store: MemoryTypedStorageStore<T>): TypedStorage<T> {
    return new Memory(store)
}

class Memory<T> {
    store: MemoryTypedStorageStore<T> = { set: false }

    constructor(store: MemoryTypedStorageStore<T>) {
        this.store = store
    }

    get(): TypedStorageFetchResult<T> {
        if (!this.store.set) {
            return { found: false }
        }
        return { found: true, decodeError: false, value: this.store.value }
    }
    set(value: T): void {
        this.store = { set: true, value }
    }
    remove(): void {
        this.store = { set: false }
    }
}
