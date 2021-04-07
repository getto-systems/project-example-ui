import {
    DB_legacy,
    FetchDBResult_legacy,
    FetchRepositoryResult,
    Repository,
    StoreRepositoryResult,
} from "./infra"

export function mockRepository<T>(): Repository<T> {
    return new DB()
}

class DB<T> implements Repository<T> {
    store: FetchRepositoryResult<T> = { success: true, found: false }

    async get(): Promise<FetchRepositoryResult<T>> {
        return this.store
    }
    async set(value: T): Promise<StoreRepositoryResult> {
        this.store = { success: true, found: true, value }
        return { success: true }
    }
    async remove(): Promise<StoreRepositoryResult> {
        this.store = { success: true, found: false }
        return { success: true }
    }
}

export function mockDB_legacy<T>(): DB_legacy<T> {
    return new MockDB_legacy()
}

class MockDB_legacy<T> implements DB_legacy<T> {
    store: FetchDBResult_legacy<T> = { found: false }

    get(): FetchDBResult_legacy<T> {
        return this.store
    }
    set(value: T): void {
        this.store = { found: true, value }
    }
    remove(): void {
        this.store = { found: false }
    }
}
