import {
    PasswordResetActionSet,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetRequest,
} from "./component"

import { ResetEvent } from "../../../password_reset/data"
import { StoreEvent } from "../../../credential/data"

export function initPasswordReset(
    actions: PasswordResetActionSet,
    param: PasswordResetParam
): PasswordResetComponent {
    return new Component(actions, param)
}

class Component implements PasswordResetComponent {
    actions: PasswordResetActionSet
    param: PasswordResetParam

    listener: Post<PasswordResetState>[] = []

    constructor(actions: PasswordResetActionSet, param: PasswordResetParam) {
        this.actions = actions
        this.param = param
    }

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach((post) => post(state))
    }

    action(request: PasswordResetRequest): void {
        switch (request.type) {
            case "reset":
                this.actions.reset(this.param.resetToken, (event) => {
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
                this.actions.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.actions.secureScriptPath(this.param.pagePathname),
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
