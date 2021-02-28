import { RepositoryError } from "./data"

export interface Repository<T> {
    get(): RepositoryFetchResult<T>
    set(value: T): RepositoryStoreResult
    remove(): RepositoryStoreResult
}

export type RepositoryFetchResult<T> =
    | Readonly<{ success: true; found: true; value: T }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: RepositoryError }>

export type RepositoryStoreResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: RepositoryError }>
