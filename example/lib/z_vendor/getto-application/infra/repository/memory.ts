import { DB, DBFetchResult } from "./infra"

export function initMemoryDB<T>(): DB<T> {
    return new Memory()
}

class Memory<T> implements DB<T> {
    store: DBFetchResult<T> = { found: false }

    get(): DBFetchResult<T> {
        return this.store
    }
    set(value: T): void {
        this.store = { found: true, value }
    }
    remove(): void {
        this.store = { found: false }
    }
}
