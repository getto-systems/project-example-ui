export interface RemoteAccess<M, V, E> {
    (send: M): Promise<RemoteAccessResult<V, E>>
}
export type RawRemoteAccess<M, V> = RemoteAccess<M, V, RemoteAccessError>

export type RemoteAccessResult<V, E> =
    | Readonly<{ success: true; value: V }>
    | Readonly<{ success: false; err: E }>

export type RemoteAccessError = Readonly<{ type: string; detail: string }>
