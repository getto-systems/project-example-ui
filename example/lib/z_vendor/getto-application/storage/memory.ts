import { StorageItem, StorageItemFetchResult } from "./infra"

export function initMemoryStorageItem(): StorageItem {
    return new Memory()
}

class Memory implements StorageItem {
    store: Store = { set: false }

    get(): StorageItemFetchResult {
        if (!this.store.set) {
            return { found: false }
        }
        return { found: true, value: this.store.value }
    }
    set(value: string): void {
        this.store = { set: true, value }
    }
    remove(): void {
        this.store = { set: false }
    }
}

type Store = Readonly<{ set: false }> | Readonly<{ set: true; value: string }>
