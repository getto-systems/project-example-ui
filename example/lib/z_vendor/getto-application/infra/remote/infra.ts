export type RemoteTypes<M, V, E> = {
    remote: Remote<M, V, E>
    result: RemoteResult<V, E>
    simulator: RemoteSimulator<M, V, E>
}

export interface Remote<M, V, E> {
    (message: M): Promise<RemoteResult<V, E>>
}
export interface RemoteSimulator<M, V, E> {
    (message: M): RemoteResult<V, E>
}

export type RemoteResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type ConvertRemoteValueResult<T, E> =
    | Readonly<{ valid: true; value: T }>
    | Readonly<{ valid: false; err: E[] }>

export type RawRemote<M, V> = Remote<M, V, RemoteError>
export type RawRemoteResult<V> = RemoteResult<V, RemoteError>

export type RemoteError = Readonly<{ type: string; err: string }>
