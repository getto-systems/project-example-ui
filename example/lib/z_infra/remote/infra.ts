export interface Remote<M, V, E> {
    (send: M): Promise<RemoteResult<V, E>>
}

export type RemoteResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type RawRemote<M, V> = Remote<M, V, RemoteError>
export type RawRemoteResult<V> = RemoteResult<V, RemoteError>

export type RemoteError = Readonly<{ type: string; detail: string }>

export interface RemoteSimulator<M, V, E> {
    (message: M): RemoteResult<V, E>
}
