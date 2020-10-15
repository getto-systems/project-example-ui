import {
    PasswordLoginActionSet,
    PasswordLoginParam,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginRequest,
    PasswordLoginFieldComponentSet,
} from "./component"

import { LoginAction } from "../../../password_login/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"
import { StoreAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { LoginEvent } from "../../../password_login/data"
import { StoreEvent } from "../../../credential/data"

type Background = Readonly<{
    login: LoginAction
    field: {
        loginID: LoginIDFieldAction
        password: PasswordFieldAction
    }
    store: StoreAction
    path: PathAction
}>

export function initPasswordLoginInit(actions: PasswordLoginActionSet, components: PasswordLoginFieldComponentSet, param: PasswordLoginParam): PasswordLoginComponent {
    return new Component(actions, components, param)
}

class Component implements PasswordLoginComponent {
    background: Background
    components: PasswordLoginFieldComponentSet
    param: PasswordLoginParam

    listener: Post<PasswordLoginState>[] = []

    constructor(actions: PasswordLoginActionSet, components: PasswordLoginFieldComponentSet, param: PasswordLoginParam) {
        this.background = {
            login: actions.login.action,
            field: actions.field,
            store: actions.store.action,
            path: actions.path,
        }
        this.setup(actions)

        this.components = components
        this.param = param
    }
    setup(actions: PasswordLoginActionSet): void {
        actions.login.subscriber.onLoginEvent(event => this.post(this.mapLoginEvent(event)))
        actions.store.subscriber.onStoreEvent(event => this.post(this.mapStoreEvent(event)))
    }
    mapLoginEvent(event: LoginEvent): PasswordLoginState {
        switch (event.type) {
            case "succeed-to-login":
                this.background.store(event.authCredential)
                return {
                    type: event.type,
                    scriptPath: this.background.path.secureScriptPath(this.param.pagePathname),
                }

            default:
                return event
        }
    }
    mapStoreEvent(event: StoreEvent): PasswordLoginState {
        return event
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: PasswordLoginRequest): void {
        switch (request.type) {
            case "login":
                this.background.login({
                    loginID: this.background.field.loginID.validate(),
                    password: this.background.field.password.validate(),
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
