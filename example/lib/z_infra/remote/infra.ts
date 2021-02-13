export interface RemoteAccess<M, V, E> {
    (send: M): Promise<RemoteAccessResult<V, E>>
}

export type RemoteAccessResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type RawRemoteAccess<M, V> = RemoteAccess<M, V, RemoteAccessError>
export type RawRemoteAccessResult<V> = RemoteAccessResult<V, RemoteAccessError>

export type RemoteAccessError = Readonly<{ type: string; detail: string }>

export interface RemoteAccessSimulator<M, V, E> {
    (message: M): RemoteAccessResult<V, E>
}
