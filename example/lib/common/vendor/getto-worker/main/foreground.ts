import {
    WorkerProxyCallID,
    WorkerProxyCallResponse,
    WorkerProxyCallMessage,
} from "./message"

export function newWorker(): Worker {
    const src = document.currentScript?.getAttribute("src")
    if (!src) {
        throw new Error("invalid script src")
    }
    return new Worker(src.replace(/\.js$/, ".worker.js"))
}

// TODO ForegroundProxy -> Proxy
export interface WorkerForegroundProxy<M> {
    method<T, E>(
        map: WorkerForegroundProxyMessageMapper<M, T>
    ): WorkerForegroundProxyMethod<T, E>
}
export interface WorkerForegroundProxyMessageMapper<M, T> {
    (message: WorkerProxyCallMessage<T>): M
}
export interface WorkerForegroundProxyAction_legacy<P, M, R>
    extends WorkerForegroundProxy<M> {
    pod(): P
    resolve(response: R): void
}
export interface WorkerForegroundProxyAction<A, M, R> extends WorkerForegroundProxy<M> {
    action(): A
    resolve(response: R): void
}

export interface WorkerForegroundProxyMethod<M, E> {
    call(message: M, post: Post<E>): void
    resolve({ id, done, event }: WorkerProxyCallResponse<E>): void
}

export class WorkerForegroundProxyBase<M> implements WorkerForegroundProxy<M> {
    post: Post<M>

    constructor(post: Post<M>) {
        this.post = post
    }

    method<T, E>(
        map: WorkerForegroundProxyMessageMapper<M, T>
    ): WorkerForegroundProxyMethod<T, E> {
        return new ProxyMethod((message) => this.post(map(message)))
    }
}

class ProxyMethod<M, E> implements WorkerForegroundProxyMethod<M, E> {
    post: Post<WorkerProxyCallMessage<M>>

    idGenerator: IDGenerator
    map: Record<number, Post<E>> = {}

    constructor(post: Post<WorkerProxyCallMessage<M>>) {
        this.post = post
        this.idGenerator = idGenerator()
    }

    call(params: M, post: Post<E>): void {
        const id = this.idGenerator()
        this.map[id] = post
        this.post({ id, params })
    }
    resolve({ id, done, event }: WorkerProxyCallResponse<E>): void {
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
