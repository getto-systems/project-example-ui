import { newIgniteHook } from "./infra/igniteHook"
import { newStateHandler } from "./infra/stateHandler"
import { newTerminateHook } from "./infra/terminateHook"

import {
    ApplicationStateAction,
    ApplicationStateIgnition,
    ApplicationStateSubscriber,
} from "./action"

import { IgniteHook, StateHandler, TerminateHook } from "./infra"

import { ApplicationHook } from "./data"

export class ApplicationAbstractStateAction<S> implements ApplicationStateAction<S> {
    pubsub: PubSub<S> = initPubSub()

    hook: Readonly<{ ignite: IgniteHook; terminate: TerminateHook }> = {
        ignite: newIgniteHook(),
        terminate: newTerminateHook(),
    }

    // this.material.doSomething(this.post) できるようにプロパティとして定義
    post: Post<S> = (state: S) => {
        this.pubsub.post(state)
    }

    ignition(): ApplicationStateIgnition<S> {
        return {
            ignite: () => {
                // 同期的な subscribe が完了した後で ignite するための setTimeout
                setTimeout(() => this.hook.ignite.run())
            },
            ...this.pubsub.subscriber,
        }
    }

    igniteHook(hook: ApplicationHook): void {
        this.hook.ignite.register(hook)
    }

    terminateHook(hook: ApplicationHook): void {
        this.hook.terminate.register(hook)
    }
    terminate(): void {
        this.pubsub.clear()
        this.hook.terminate.run()
    }
}

type PubSub<S> = Readonly<{
    post: Post<S>
    subscriber: ApplicationStateSubscriber<S>
    clear: { (): void }    
}>

function initPubSub<S>(): PubSub<S> {
    const stateHandler: StateHandler<S> = newStateHandler()
    return {
        post: (state: S) => stateHandler.post(state),
        subscriber: {
            addStateHandler: (handler) => stateHandler.subscribe(handler),
            removeStateHandler: (target) => stateHandler.unsubscribe(target),
        },
        clear: () => stateHandler.clear(),
    }
}

interface Post<S> {
    (state: S): void
}
