export interface DB<T> {
    get(): DBFetchResult<T>
    set(value: T): DBStoreResult
    remove(): void
}

export type DBFetchResult<T> =
    | Readonly<{ found: true; result: DBTransformResult<T> }>
    | Readonly<{ found: false }>

export type DBStoreResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: DBTransformError }>

export interface DBTransformer<T> {
    toString(value: T): DBTransformResult<string>
    fromString(raw: string): DBTransformResult<T>
}

export type DBTransformResult<T> =
    | Readonly<{ success: true; value: T }>
    | Readonly<{ success: false; err: DBTransformError }>

export type DBTransformError = Readonly<{ type: "transform-error"; err: string }>
