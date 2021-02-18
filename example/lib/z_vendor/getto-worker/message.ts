export type WorkerProxySpec<N, P, E> = {
    method: WorkerProxyMethod<N, P, E>
    message: WorkerProxyCallMessage<N, P>
    response: WorkerProxyCallResponse<N, E>
}
export interface WorkerProxyMethod<N, P, E> {
    readonly method: N
    call(params: P, post: Post<E>): void
    resolve(response: WorkerProxyCallResponse<N, E>): void
}
export type WorkerProxyCallMessage<N, P> = Readonly<{
    method: N
    id: WorkerProxyCallID
    params: P
}>
export type WorkerProxyCallResponse<N, E> = Readonly<{
    method: N
    id: WorkerProxyCallID
    done: boolean
    event: E
}>

export type WorkerProxyCallID = number

interface Post<M> {
    (message: M): void
}
