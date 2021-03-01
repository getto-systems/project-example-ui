export interface DB<T> {
    get(): DBFetchResult<T>
    set(value: T): void
    remove(): void
}

export type DBFetchResult<T> =
    | Readonly<{ found: true; value: T }>
    | Readonly<{ found: false }>

export interface DBTransformer<T> {
    toString(value: T): string
    fromString(raw: string): T
}
