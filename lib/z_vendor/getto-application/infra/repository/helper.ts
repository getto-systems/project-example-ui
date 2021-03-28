import { RepositoryError } from "./data"
import {
    DB,
    Repository,
    RepositoryConverter,
    FetchRepositoryResult,
    RepositoryPod,
    StoreRepositoryResult,
} from "./infra"

export function wrapRepository<V, R>(db: DB<R>): RepositoryPod<V, R> {
    return (converter) => new Wrapped(db, converter)
}

class Wrapped<V, R> implements Repository<V> {
    db: DB<R>
    converter: RepositoryConverter<V, R>

    constructor(db: DB<R>, converter: RepositoryConverter<V, R>) {
        this.db = db
        this.converter = converter
    }

    get(): FetchRepositoryResult<V> {
        const fetchResult = this.fetch()
        if (!fetchResult.success || !fetchResult.found) {
            return fetchResult
        }

        const convertResult = this.converter.fromRepository(fetchResult.value)
        if (!convertResult.valid) {
            return { success: true, found: false }
        }

        return { success: true, found: true, value: convertResult.value }
    }
    fetch(): FetchRepositoryResult<R> {
        try {
            return { success: true, ...this.db.get() }
        } catch (err) {
            return repositoryError(err)
        }
    }
    set(value: V): StoreRepositoryResult {
        try {
            this.db.set(this.converter.toRepository(value))
            return { success: true }
        } catch (err) {
            return repositoryError(err)
        }
    }
    remove(): StoreRepositoryResult {
        try {
            this.db.remove()
            return { success: true }
        } catch (err) {
            return repositoryError(err)
        }
    }
}

function repositoryError(err: unknown): Readonly<{ success: false; err: RepositoryError }> {
    return { success: false, err: { type: "infra-error", err: `${err}` } }
}
