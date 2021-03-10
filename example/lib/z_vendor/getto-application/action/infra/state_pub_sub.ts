import { ActionStateHandler, ActionStateSubscriber } from "../action"
import { ActionStatePublisher } from "../infra"

export type ActionStatePubSub<S> = Readonly<{
    pub: ActionStatePublisher<S>
    sub: ActionStateSubscriber<S>
}>
export function initActionStatePubSub<S>(): ActionStatePubSub<S> {
    return new PubSub<S>()
}

class PubSub<S> {
    handlers: ActionStateHandler<S>[] = []

    pub: ActionStatePublisher<S> = {
        post: (state) => {
            this.handlers.forEach((post) => post(state))
        },
        terminate: () => {
            this.handlers = []
        },
    }
    sub: ActionStateSubscriber<S> = {
        subscribe: (handler) => {
            this.handlers = [...this.handlers, handler]
        },
        unsubscribe: (target) => {
            this.handlers = this.handlers.filter((handler) => handler !== target)
        },
    }
}
