import { LoginLink } from "../link"

import { PasswordLoginActionSet, PasswordLoginComponent, PasswordLoginState } from "./component"

import { LoginEvent } from "../../login/password_login/data"
import { StoreEvent } from "../../login/renew/data"
import { LoadError } from "../../common/application/data"

export function initPasswordLogin(actions: PasswordLoginActionSet): PasswordLoginComponent {
    return new Component(actions)
}

class Component implements PasswordLoginComponent {
    actions: PasswordLoginActionSet

    listener: Post<PasswordLoginState>[] = []

    link: LoginLink

    constructor(actions: PasswordLoginActionSet) {
        this.actions = actions
        this.link = actions.link
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach((post) => post(state))
    }

    login(): void {
        this.actions.login((event) => {
            this.post(this.mapLoginEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    mapLoginEvent(event: LoginEvent): PasswordLoginState {
        switch (event.type) {
            case "succeed-to-login":
                this.actions.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.actions.secureScriptPath(),
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
