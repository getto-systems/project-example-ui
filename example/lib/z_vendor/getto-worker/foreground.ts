import {
    WorkerProxyCallID,
    WorkerProxyCallResponse,
    WorkerProxyCallMessage,
    WorkerProxyMethod,
} from "./message"

export function newWorker(): Worker {
    const src = document.currentScript?.getAttribute("src")
    if (!src) {
        throw new Error("invalid script src")
    }
    return new Worker(src.replace(/\.js$/, ".worker.js"))
}

export interface WorkerProxyContainer<M> {
    method<T, E>(map: WorkerProxyMessageMapper<M, T>): WorkerProxyMethod<T, E>
}
export interface WorkerProxy<A, M, R> extends WorkerProxyContainer<M> {
    action(): A
    resolve(response: R): void
}

export interface WorkerProxyMessageMapper<M, T> {
    (message: WorkerProxyCallMessage<T>): M
}

export class WorkerAbstractProxy<M> implements WorkerProxyContainer<M> {
    post: Post<M>

    constructor(post: Post<M>) {
        this.post = post
    }

    method<T, E>(map: WorkerProxyMessageMapper<M, T>): WorkerProxyMethod<T, E> {
        return new ProxyMethod((message) => this.post(map(message)))
    }
}

class ProxyMethod<M, E> implements WorkerProxyMethod<M, E> {
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
