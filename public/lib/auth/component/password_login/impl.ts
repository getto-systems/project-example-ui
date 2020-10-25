import {
    PasswordLoginActionSet,
    PasswordLoginParam,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginRequest,
} from "./component"

import { LoginEvent } from "../../../password_login/data"
import { StoreEvent } from "../../../credential/data"

export function initPasswordLogin(
    background: PasswordLoginActionSet,
    param: PasswordLoginParam
): PasswordLoginComponent {
    return new Component(background, param)
}

class Component implements PasswordLoginComponent {
    background: PasswordLoginActionSet
    param: PasswordLoginParam

    listener: Post<PasswordLoginState>[] = []

    constructor(background: PasswordLoginActionSet, param: PasswordLoginParam) {
        this.background = background
        this.param = param
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach((post) => post(state))
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
