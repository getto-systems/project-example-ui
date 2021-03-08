export type LocationTypes<K, T> = {
    detecter: LocationDetecter<T>
    method: LocationDetectMethod<T>
    info: T
    keys: K
}

export interface LocationDetecter<T> {
    (): ConvertLocationResult<T>
}
export interface LocationDetectMethod<T> {
    (currentURL: URL): ConvertLocationResult<T>
}

export type ConvertLocationResult<T> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false }>
