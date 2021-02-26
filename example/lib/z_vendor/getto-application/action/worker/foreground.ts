import {
    WorkerProxyCallID,
    WorkerProxyMethod,
    WorkerProxyCallMessage,
    WorkerProxyCallResponse,
} from "./message"

export interface WorkerProxy<M, R> {
    method<N, P, E>(method: N, map: WorkerProxyMessageMapper<N, M, P>): WorkerProxyMethod<N, P, E>
    resolve(response: R): void
}

export interface WorkerProxyMessageMapper<N, M, T> {
    (message: WorkerProxyCallMessage<N, T>): M
}

export abstract class WorkerAbstractProxy<M, R> implements WorkerProxy<M, R> {
    post: Post<M>

    constructor(post: Post<M>) {
        this.post = post
    }

    method<N, T, E>(method: N, map: WorkerProxyMessageMapper<N, M, T>): WorkerProxyMethod<N, T, E> {
        return new ProxyMethod(method, (message) => this.post(map(message)))
    }

    abstract resolve(response: R): void
}
class ProxyMethod<N, M, E> implements WorkerProxyMethod<N, M, E> {
    readonly method: N
    post: Post<WorkerProxyCallMessage<N, M>>

    idGenerator: IDGenerator
    map: Record<number, Post<E>> = {}

    constructor(method: N, post: Post<WorkerProxyCallMessage<N, M>>) {
        this.method = method
        this.post = post
        this.idGenerator = idGenerator()
    }

    call(params: M, post: Post<E>): void {
        const id = this.idGenerator()
        this.map[id] = post
        this.post({ method: this.method, id, params })
    }
    resolve({ id, done, event }: WorkerProxyCallResponse<N, E>): void {
        if (!this.map[id]) {
            throw new Error("handler is not set")
        }

        this.map[id](event)

        if (done) {
            delete this.map[id]
        }
    }
}

function idGenerator(): IDGenerator {
    let id = 0
    return () => id++
}

interface IDGenerator {
    (): WorkerProxyCallID
}
interface Post<M> {
    (message: M): void
}
