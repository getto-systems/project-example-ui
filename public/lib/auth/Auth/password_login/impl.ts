import { LoginLink } from "../link"

import { PasswordLoginMaterial, PasswordLoginComponent, PasswordLoginState } from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"

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
            switch (event.type) {
                case "succeed-to-login":
                    this.storeAuthCredential(event.authCredential, () => {
                        this.tryToLoad(event)
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    tryToLoad(event: { type: "succeed-to-login" }): void {
        this.post({
            type: event.type,
            scriptPath: this.material.secureScriptPath(),
        })
    }

    storeAuthCredential(authCredential: AuthCredential, hook: { (): void }): void {
        this.material.store(authCredential, (event) => {
            switch (event.type) {
                case "succeed-to-store":
                    hook()
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
}

interface Post<T> {
    (state: T): void
}
