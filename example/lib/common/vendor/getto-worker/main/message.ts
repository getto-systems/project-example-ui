export interface WorkerProxyMethod<M, E> {
    call(message: M, post: Post<E>): void
    resolve({ id, done, event }: WorkerProxyCallResponse<E>): void
}

export type WorkerProxyMessage<N, P> = Readonly<{ method: N }> & WorkerProxyCallMessage<P>
export type WorkerProxyResponse<N, E> = Readonly<{ method: N }> & WorkerProxyCallResponse<E>

export type WorkerProxyCallMessage<P> = Readonly<{
    id: WorkerProxyCallID
    params: P
}>
export type WorkerProxyCallResponse<E> = Readonly<{
    id: WorkerProxyCallID
    done: boolean
    event: E
}>

export type WorkerProxyCallID = number

interface Post<M> {
    (message: M): void
}
