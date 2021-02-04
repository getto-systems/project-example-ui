// storage 実装クラスが throw したエラーは catch されない
export interface TypedStorage<T> {
    get(): TypedStorageFetchResult<T>
    set(value: T): void
    remove(): void
}

export type TypedStorageFetchResult<T> =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; decodeError: true; err: unknown }>
    | Readonly<{ found: true; decodeError: false; value: T }>

export type TypedStorageConverter<T> = TypedStorageValueConverter<T, string>
export interface TypedStorageValueConverter<T, R> {
    toRaw(value: T): R
    toValue(raw: R): TypedStorageValue<T>
}

export type TypedStorageValue<T> =
    | Readonly<{ decodeError: true; err: unknown }>
    | Readonly<{ decodeError: false; value: T }>

export function decodeSuccess<T>(value: T): TypedStorageValue<T> {
    return { decodeError: false, value }
}
export function decodeError<T>(err: unknown): TypedStorageValue<T> {
    return { decodeError: true, err }
}
