import { DB_legacy, FetchDBResult_legacy, DBTransformer } from "./infra"

export function initStorage_legacy<T>(
    storage: Storage,
    key: string,
    transformer: DBTransformer<T>,
): DB_legacy<T> {
    return new Storage_legacy(storage, key, transformer)
}

class Storage_legacy<T> implements DB_legacy<T> {
    readonly storage: Storage
    readonly key: string

    readonly transformer: DBTransformer<T>

    constructor(storage: Storage, key: string, transformer: DBTransformer<T>) {
        this.storage = storage
        this.key = key
        this.transformer = transformer
    }

    get(): FetchDBResult_legacy<T> {
        const value = this.storage.getItem(this.key)
        if (!value) {
            return { found: false }
        }

        const result = this.fromString(value)
        if (!result.success) {
            return { found: false }
        }

        return { found: true, value: result.value }
    }
    set(value: T): void {
        const result = this.toString(value)
        if (!result.success) {
            this.remove()
            return
        }

        this.storage.setItem(this.key, result.value)
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }

    // transform のエラーはこの中で吸収する
    fromString(value: string): TransformResult<T> {
        try {
            return { success: true, value: this.transformer.fromString(value) }
        } catch (err) {
            return { success: false }
        }
    }
    toString(value: T): TransformResult<string> {
        try {
            return { success: true, value: this.transformer.toString(value) }
        } catch (err) {
            return { success: false }
        }
    }
}

type TransformResult<T> = Readonly<{ success: true; value: T }> | Readonly<{ success: false }>
