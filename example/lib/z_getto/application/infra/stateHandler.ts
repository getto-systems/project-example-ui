import { ApplicationStateHandler } from "../data"
import { StateHandler } from "../infra"

export function newStateHandler<S>(): StateHandler<S> {
    return new Handler()
}

class Handler<S> implements StateHandler<S> {
    handlers: ApplicationStateHandler<S>[] = []

    post(state: S) {
        this.handlers.forEach((post) => post(state))
    }

    subscribe(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    unsubscribe(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }
    clear(): void {
        this.handlers = []
    }
}
