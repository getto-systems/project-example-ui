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
    encode(value: T): R
    decode(raw: R): TypedStorageDecoded<T>
}

export type TypedStorageDecoded<T> =
    | Readonly<{ decodeError: true; err: unknown }>
    | Readonly<{ decodeError: false; value: T }>

export function decodeSuccess<T>(value: T): TypedStorageDecoded<T> {
    return { decodeError: false, value }
}
export function decodeError<T>(err: unknown): TypedStorageDecoded<T> {
    return { decodeError: true, err }
}
