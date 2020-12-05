import { LoginLink } from "../link"

import { PasswordLoginMaterial, PasswordLoginComponent, PasswordLoginState } from "./component"

import { LoginEvent } from "../../login/password_login/data"
import { StoreEvent } from "../../login/renew/data"
import { LoadError } from "../../common/application/data"

export function initPasswordLogin(material: PasswordLoginMaterial): PasswordLoginComponent {
    return new Component(material)
}

class Component implements PasswordLoginComponent {
    material: PasswordLoginMaterial

    listener: Post<PasswordLoginState>[] = []

    link: LoginLink

    constructor(material: PasswordLoginMaterial) {
        this.material = material
        this.link = material.link
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach((post) => post(state))
    }

    login(): void {
        this.material.login((event) => {
            this.post(this.mapLoginEvent(event))
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    mapLoginEvent(event: LoginEvent): PasswordLoginState {
        switch (event.type) {
            case "succeed-to-login":
                this.material.store(event.authCredential, (event) => {
                    this.post(this.mapStoreEvent(event))
                })
                return {
                    type: event.type,
                    scriptPath: this.material.secureScriptPath(),
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
