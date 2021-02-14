export type WorkerProxyMethodMessage<N, P> = Readonly<{ method: N }> & WorkerProxyCallMessage<P>
export type WorkerProxyMethodResponse<N, E> = Readonly<{ method: N }> & WorkerProxyCallResponse<E>

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
