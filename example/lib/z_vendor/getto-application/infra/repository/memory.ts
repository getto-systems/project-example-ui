import { Repository, RepositoryFetchResult, RepositoryStoreResult } from "./infra"

export function initMemoryRepository<T>(): Repository<T> {
    return new Memory()
}

class Memory<T> implements Repository<T> {
    store: Store<T> = { set: false }

    get(): RepositoryFetchResult<T> {
        if (!this.store.set) {
            return { success: true, found: false }
        }
        return { success: true, found: true, value: this.store.value }
    }
    set(value: T): RepositoryStoreResult {
        this.store = { set: true, value }
        return { success: true }
    }
    remove(): RepositoryStoreResult {
        this.store = { set: false }
        return { success: true }
    }
}

type Store<T> = Readonly<{ set: false }> | Readonly<{ set: true; value: T }>
