import {
    PasswordLoginActionSet,
    PasswordLoginParam,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginRequest,
} from "./component"

import { LoginAction } from "../../../password_login/action"
import { StoreAction } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { LoginEvent } from "../../../password_login/data"
import { StoreEvent } from "../../../credential/data"

type Background = Readonly<{
    login: LoginAction
    store: StoreAction
    path: PathAction
}>

export function initPasswordLogin(actions: PasswordLoginActionSet, param: PasswordLoginParam): PasswordLoginComponent {
    return new Component(actions, param)
}

class Component implements PasswordLoginComponent {
    background: Background
    param: PasswordLoginParam

    listener: Post<PasswordLoginState>[] = []

    constructor(actions: PasswordLoginActionSet, param: PasswordLoginParam) {
        this.background = {
            login: actions.login,
            store: actions.store.action,
            path: actions.path,
        }
        this.setup(actions)

        this.param = param
    }
    setup(actions: PasswordLoginActionSet): void {
        actions.store.subscriber.onStoreEvent(event => this.post(this.mapStoreEvent(event)))
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
                this.background.login((event) => {
                    this.post(this.mapLoginEvent(event))
                })
                return

            case "load-error":
                this.post({ type: "load-error", err: request.err })
                return

            default:
                assertNever(request)
        }
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
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
