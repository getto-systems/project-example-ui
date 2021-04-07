import { RepositoryError } from "./data"

export interface RepositoryPod<V, R> {
    (converter: RepositoryConverter<V, R>): Repository<V>
}

export interface RepositoryPod_legacy<V, R> {
    (converter: RepositoryConverter<V, R>): Repository_legacy<V>
}

export interface RepositoryConverter<V, R> {
    toRepository(value: V): R
    fromRepository(raw: R): ConvertRepositoryResult<V>
}

export interface Repository<T> {
    get(): Promise<FetchRepositoryResult<T>>
    set(value: T): Promise<StoreRepositoryResult>
    remove(): Promise<StoreRepositoryResult>
}

export interface Repository_legacy<T> {
    get(): FetchRepositoryResult<T>
    set(value: T): StoreRepositoryResult
    remove(): StoreRepositoryResult
}

export type FetchRepositoryResult<T> =
    | Readonly<{ success: true; found: true; value: T }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: RepositoryError }>

export type StoreRepositoryResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: RepositoryError }>

export type ConvertRepositoryResult<T> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false }>

// z_external/db のインターフェイスと合わせる
export interface DB_legacy<T> {
    get(): FetchDBResult_legacy<T>
    set(value: T): void
    remove(): void
}
export type FetchDBResult_legacy<T> = Readonly<{ found: true; value: T }> | Readonly<{ found: false }>
