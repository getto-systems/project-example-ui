export interface DB<T> {
    get(): Promise<FetchDBResult<T>>
    set(value: T): Promise<StoreDBResult>
    remove(): Promise<StoreDBResult>
}

export type FetchDBResult<T> =
    | Readonly<{ success: true; found: true; value: T }>
    | Readonly<{ success: true; found: false }>
    | DBErrorResult

export type StoreDBResult = Readonly<{ success: true }> | DBErrorResult

export type DBErrorResult = Readonly<{ success: false; err: DBError }>

export type DBError = Readonly<{ type: "infra-error"; err: string }>

export interface DB_legacy<T> {
    get(): FetchDBResult_legacy<T>
    set(value: T): void
    remove(): void
}

export type FetchDBResult_legacy<T> =
    | Readonly<{ found: true; value: T }>
    | Readonly<{ found: false }>

export interface DBTransformer_legacy<T> {
    toString(value: T): string
    fromString(raw: string): T
}

export type DBConverter<T> = Readonly<{
    toDB: ToDBConverter<T>
    fromDB: FromDBConverter<T>
}>
export interface ToDBConverter<T> {
    (value: T): string
}
export interface FromDBConverter<T> {
    (raw: string): T
}
