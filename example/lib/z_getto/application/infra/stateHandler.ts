import { ApplicationStateHandler } from "../data"
import { StateHandler } from "../infra"

export function newStateHandler<S>(): StateHandler<S> {
    return new Handler()
}

class Handler<S> {
    handlers: ApplicationStateHandler<S>[] = []

    post(state: S) {
        this.handlers.forEach((post) => post(state))
    }

    add(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    remove(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }
    removeAll(): void {
        this.handlers = []
    }
}
