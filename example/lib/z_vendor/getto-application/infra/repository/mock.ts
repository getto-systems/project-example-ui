import { DB, FetchDBResult } from "./infra"

export function mockDB<T>(): DB<T> {
    return new Memory()
}

class Memory<T> implements DB<T> {
    store: FetchDBResult<T> = { found: false }

    get(): FetchDBResult<T> {
        return this.store
    }
    set(value: T): void {
        this.store = { found: true, value }
    }
    remove(): void {
        this.store = { found: false }
    }
}
