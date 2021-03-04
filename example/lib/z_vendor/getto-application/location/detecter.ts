export type ConvertLocationResult<T> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false }>

export interface LocationDetecter<T> {
    (): ConvertLocationResult<T>
}
export interface LocationDetectMethod<T> {
    (currentURL: URL): ConvertLocationResult<T>
}
