import {
    PasswordResetActionSet,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetRequest,
} from "./component"

import { ResetEvent } from "../../../password_reset/data"
import { StoreEvent } from "../../../credential/data"

export function initPasswordReset(background: PasswordResetActionSet, param: PasswordResetParam): PasswordResetComponent {
    return new Component(background, param)
}

class Component implements PasswordResetComponent {
    background: PasswordResetActionSet
    param: PasswordResetParam

    listener: Post<PasswordResetState>[] = []

    constructor(background: PasswordResetActionSet, param: PasswordResetParam) {
        this.background = background
        this.param = param
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
                this.background.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.background.secureScriptPath(this.param.pagePathname),
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
