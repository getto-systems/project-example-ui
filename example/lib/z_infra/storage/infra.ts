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

export interface TypedStorageConverter<T> {
    encode(value: T): string
    decode(raw: string): TypedStorageDecoded<T>
}

export type TypedStorageDecoded<T> =
    | Readonly<{ decodeError: true; err: unknown }>
    | Readonly<{ decodeError: false; value: T }>
