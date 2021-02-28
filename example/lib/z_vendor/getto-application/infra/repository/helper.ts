import { RepositoryError } from "./data"
import { Repository, RepositoryFetchResult, RepositoryStoreResult } from "./infra"

export function wrapRepository<T>(db: DB<T>): Repository<T> {
    return new Wrapped(db)
}

class Wrapped<T> implements Repository<T> {
    db: DB<T>

    constructor(db: DB<T>) {
        this.db = db
    }

    get(): RepositoryFetchResult<T> {
        try {
            const response = this.db.get()
            if (!response.found) {
                return { success: true, found: false }
            }
            if (!response.result.success) {
                return { success: false, err: response.result.err }
            }
            return { success: true, found: true, value: response.result.value }
        } catch (err) {
            return storageError(err)
        }
    }
    set(value: T): RepositoryStoreResult {
        try {
            return this.db.set(value)
        } catch (err) {
            return storageError(err)
        }
    }
    remove(): RepositoryStoreResult {
        try {
            this.db.remove()
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
}

function storageError(err: unknown): Readonly<{ success: false; err: RepositoryError }> {
    return { success: false, err: { type: "infra-error", err: `${err}` } }
}

// z_external/db のインターフェイスと合わせる
interface DB<T> {
    get(): DBFetchResult<T>
    set(value: T): DBStoreResult
    remove(): void
}

type DBFetchResult<T> =
    | Readonly<{ found: true; result: DBTransformResult<T> }>
    | Readonly<{ found: false }>

type DBStoreResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: DBTransformError }>

type DBTransformResult<T> =
    | Readonly<{ success: true; value: T }>
    | Readonly<{ success: false; err: DBTransformError }>

type DBTransformError = Readonly<{ type: "transform-error"; err: string }>
