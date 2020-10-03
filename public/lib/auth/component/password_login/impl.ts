import { AuthBackground } from "../../usecase"

import {
    PasswordLoginComponent,
    PasswordLoginComponentRequest,
    PasswordLoginState,
} from "../password_login/component"

import { initialPasswordLoginRequest, PasswordLoginEventSubscriber } from "../../../password_login/action"

//import { LoginIDFieldAction } from "../../../login_id/field/action"
//import { PasswordFieldAction } from "../../../password/field/action"

import { LoginEvent } from "../../../password_login/data"

export function initPasswordLoginComponent(background: AuthBackground): PasswordLoginComponent {
    return new Component(background)
}

class Component implements PasswordLoginComponent {
    background: AuthBackground

    listener: Post<PasswordLoginState>[] = []

    request: PasswordLoginComponentRequest = {
        passwordLogin: initialPasswordLoginRequest,

        /*
        field: {
            loginID: initialLoginIDFieldRequest,
            password: initialPasswordFieldRequest,
        },
         */
    }

    constructor(background: AuthBackground) {
        this.background = background
    }

    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        this.listener.push(stateChanged)
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach(post => post(state))
    }

    subscribePasswordLogin(subscriber: PasswordLoginEventSubscriber): void {
        subscriber.onLoginEvent(event => this.post(this.mapLoginEvent(event)))
    }
    mapLoginEvent(event: LoginEvent): PasswordLoginState {
        if (event.type === "succeed-to-login") {
            this.background.credential({ type: "store", authCredential: event.authCredential })
        }
        return event
    }

    setRequest(request: PasswordLoginComponentRequest): void {
        this.request = request
    }

    login(): void {
        /*
        this.action.passwordLogin({
            type: "login",
            content: {
                loginID: this.action.field.loginID.validate(),
                password: this.action.field.password.validate(),
            }
        })
         */
    }
}

interface Post<T> {
    (state: T): void
}
