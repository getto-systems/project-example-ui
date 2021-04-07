import { RepositoryError } from "./data"
import {
    DB_legacy,
    Repository_legacy,
    RepositoryConverter,
    FetchRepositoryResult,
    RepositoryPod_legacy,
    StoreRepositoryResult,
    Repository,
    RepositoryPod,
} from "./infra"

export function convertRepository<V, R>(db: Repository<R>): RepositoryPod<V, R> {
    return (converter) => new Converter(db, converter)
}

class Converter<V, R> implements Repository<V> {
    db: Repository<R>
    converter: RepositoryConverter<V, R>

    constructor(db: Repository<R>, converter: RepositoryConverter<V, R>) {
        this.db = db
        this.converter = converter
    }

    async get(): Promise<FetchRepositoryResult<V>> {
        const raw = await this.db.get()
        if (!raw.success || !raw.found) {
            return raw
        }

        const convertResult = this.converter.fromRepository(raw.value)
        if (!convertResult.valid) {
            return { success: true, found: false }
        }

        return { success: true, found: true, value: convertResult.value }
    }
    set(value: V): Promise<StoreRepositoryResult> {
        return this.db.set(this.converter.toRepository(value))
    }
    remove(): Promise<StoreRepositoryResult> {
        return this.db.remove()
    }
}

export function wrapRepository<V, R>(db: DB_legacy<R>): RepositoryPod_legacy<V, R> {
    return (converter) => new Wrapped(db, converter)
}

class Wrapped<V, R> implements Repository_legacy<V> {
    db: DB_legacy<R>
    converter: RepositoryConverter<V, R>

    constructor(db: DB_legacy<R>, converter: RepositoryConverter<V, R>) {
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
