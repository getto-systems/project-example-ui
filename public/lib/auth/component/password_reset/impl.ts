import {
    PasswordResetActionSet,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetRequest,
} from "./component"

import { ResetAction } from "../../../password_reset/action"
import { StoreAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { ResetEvent } from "../../../password_reset/data"
import { StoreEvent } from "../../../credential/data"

type Background = Readonly<{
    reset: ResetAction
    store: StoreAction
    path: PathAction
}>

export function initPasswordReset(actions: PasswordResetActionSet, param: PasswordResetParam): PasswordResetComponent {
    return new Component(actions, param)
}

class Component implements PasswordResetComponent {
    background: Background
    param: PasswordResetParam

    listener: Post<PasswordResetState>[] = []

    constructor(actions: PasswordResetActionSet, param: PasswordResetParam) {
        this.background = {
            reset: actions.reset,
            store: actions.store.action,
            path: actions.path,
        }
        this.setup(actions)

        this.param = param
    }
    setup(actions: PasswordResetActionSet): void {
        actions.store.subscriber.onStoreEvent(event => this.post(this.mapStoreEvent(event)))
    }

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: PasswordResetRequest): void {
        switch (request.type) {
            case "reset":
                this.background.reset(this.param.resetToken, (event) => {
                    this.post(this.mapResetEvent(event))
                })
                return

            case "load-error":
                this.post({ type: "load-error", err: request.err })
                return

            default:
                assertNever(request)
        }
    }

    mapResetEvent(event: ResetEvent): PasswordResetState {
        switch (event.type) {
            case "succeed-to-reset":
                this.background.store(event.authCredential)
                return {
                    type: event.type,
                    scriptPath: this.background.path.secureScriptPath(this.param.pagePathname),
                }

            default:
                return event
        }
    }
    mapStoreEvent(event: StoreEvent): PasswordResetState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
