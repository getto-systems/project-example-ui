import { initActionIgniteRunner } from "./infra/ignite_runner"
import { initActionStatePubSub } from "./infra/state_pub_sub"
import { initActionTerminateRunner } from "./infra/terminate_runner"

import {
    ApplicationActionIgniteHook,
    ApplicationActionIgniteRunner,
    ApplicationActionTerminateHook,
    ApplicationActionTerminateRunner,
} from "./infra"

import { ApplicationActionStateSubscriber, ApplicationStateAction } from "./action"

export abstract class ApplicationAbstractStateAction<S> implements ApplicationStateAction<S> {
    abstract readonly initialState: S

    readonly subscriber: ApplicationActionStateSubscriber<S>

    // this.material.doSomething(this.post) できるようにプロパティとして提供
    readonly post: Post<S>

    readonly igniteRunner: ApplicationActionIgniteRunner = initActionIgniteRunner()
    readonly terminateRunner: ApplicationActionTerminateRunner = initActionTerminateRunner()

    constructor() {
        const { pub, sub } = initActionStatePubSub<S>()
        this.subscriber = sub

        this.post = (state: S) => pub.post(state)

        this.terminateHook(() => {
            pub.terminate()
        })
    }

    igniteHook(hook: ApplicationActionIgniteHook): void {
        this.igniteRunner.register(hook)
    }
    terminateHook(hook: ApplicationActionTerminateHook): void {
        this.terminateRunner.register(hook)
    }

    ignite(): void {
        // すべての subscriber が登録された後で ignite するための setTimeout
        setTimeout(() => this.igniteRunner.ignite())
    }
    terminate(): void {
        this.igniteRunner.terminate()
        this.terminateRunner.terminate()
    }
}

interface Post<S> {
    (state: S): S
}
