export type RemoteTypes<M, V, R, E> = {
    pod: RemotePod<M, V, R, E>
    result: RemoteResult<V, E>
    simulator: RemoteSimulator<M, R, E>
}

export type RemoteTypes_legacy<M, V, E> = {
    remote: Remote<M, V, E>
    result: RemoteResult<V, E>
    simulator: RemoteSimulator<M, V, E>
}

export interface RemotePod<M, V, R, E> {
    (converter: RemoteConverter<V, R>): Remote<M, V, E>
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

export interface RemoteConverter<V, R> {
    (raw: R): V
}

export type RawRemote<M, V> = Remote<M, V, RemoteError>
export type RawRemoteResult<V> = RemoteResult<V, RemoteError>

export type RemoteError = Readonly<{ type: string; err: string }>
