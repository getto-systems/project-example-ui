import { StorageItem, StorageItemFetchResult } from "./infra"

export function initWebStorageItem(storage: Storage, key: string): StorageItem {
    return new Item(storage, key)
}

class Item implements StorageItem {
    storage: Storage
    key: string

    constructor(storage: Storage, key: string) {
        this.storage = storage
        this.key = key
    }

    get(): StorageItemFetchResult {
        const value = this.storage.getItem(this.key)
        if (!value) {
            return { found: false }
        }
        return { found: true, value }
    }
    set(value: string): void {
        this.storage.setItem(this.key, value)
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }
}
