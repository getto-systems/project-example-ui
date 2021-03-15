import { ApplicationActionStateHandler, ApplicationActionStateSubscriber } from "../action"
import { ActionStatePublisher } from "../infra"

export type ActionStatePubSub<S> = Readonly<{
    pub: ActionStatePublisher<S>
    sub: ApplicationActionStateSubscriber<S>
}>
export function initActionStatePubSub<S>(): ActionStatePubSub<S> {
    return new PubSub<S>()
}

class PubSub<S> {
    handlers: ApplicationActionStateHandler<S>[] = []

    pub: ActionStatePublisher<S> = {
        post: (state) => {
            this.handlers.forEach((post) => post(state))
        },
        terminate: () => {
            this.handlers = []
        },
    }
    sub: ApplicationActionStateSubscriber<S> = {
        subscribe: (handler) => {
            this.handlers = [...this.handlers, handler]
        },
        unsubscribe: (target) => {
            this.handlers = this.handlers.filter((handler) => handler !== target)
        },
    }
}
