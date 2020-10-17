import {
    PasswordResetActionSet,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetRequest,
    PasswordResetFieldComponentSet,
} from "./component"

import { ResetAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"
import { StoreAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { ResetEvent } from "../../../password_reset/data"
import { StoreEvent } from "../../../credential/data"

type Background = Readonly<{
    reset: ResetAction
    field: {
        loginID: LoginIDFieldAction
        password: PasswordFieldAction
    }
    store: StoreAction
    path: PathAction
}>

export function initPasswordReset(actions: PasswordResetActionSet, components: PasswordResetFieldComponentSet, param: PasswordResetParam): PasswordResetComponent {
    return new Component(actions, components, param)
}

class Component implements PasswordResetComponent {
    param: PasswordResetParam
    background: Background
    components: PasswordResetFieldComponentSet

    listener: Post<PasswordResetState>[] = []

    constructor(actions: PasswordResetActionSet, components: PasswordResetFieldComponentSet, param: PasswordResetParam) {
        this.background = {
            reset: actions.reset,
            field: actions.field,
            store: actions.store.action,
            path: actions.path,
        }
        this.setup(actions)

        this.param = param
        this.components = components
    }
    setup(actions: PasswordResetActionSet): void {
        actions.store.subscriber.onStoreEvent(event => this.post(this.mapStoreEvent(event)))
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

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: PasswordResetRequest): void {
        switch (request.type) {
            case "reset":
                this.background.reset(this.param.resetToken, {
                    loginID: this.background.field.loginID.validate(),
                    password: this.background.field.password.validate(),
                }, (event) => {
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
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
