import { newIgniteHook } from "./infra/igniteHook"
import { newStateHandler } from "./infra/stateHandler"
import { newTerminateHook } from "./infra/terminateHook"

import { ApplicationAction } from "./action"

import { IgniteHook, StateHandler, TerminateHook } from "./infra"

import { ApplicationHook, ApplicationStateHandler } from "./data"

export class ApplicationAbstractAction<S> implements ApplicationAction<S> {
    stateHandler: StateHandler<S> = newStateHandler()

    hook: Readonly<{ ignite: IgniteHook; terminate: TerminateHook }> = {
        ignite: newIgniteHook(),
        terminate: newTerminateHook(),
    }

    // this.material.doSomething(this.post) できるようにプロパティとして定義
    post: Post<S> = (state: S) => {
        this.stateHandler.post(state)
    }

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.stateHandler.add(handler)
    }
    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.stateHandler.remove(target)
    }

    igniteHook(hook: ApplicationHook): void {
        this.hook.ignite.register(hook)
    }
    ignite(): void {
        // 同期的にすべての state handler を追加した後で ignite するための setTimeout
        setTimeout(() => {
            this.hook.ignite.run()
        })
    }

    terminateHook(hook: ApplicationHook): void {
        this.hook.terminate.register(hook)
    }
    terminate(): void {
        this.stateHandler.removeAll()
        this.hook.terminate.run()
    }
}

interface Post<S> {
    (state: S): void
}
