import { LoginLink } from "../link"

import { PasswordLoginMaterial, PasswordLoginComponent, PasswordLoginState } from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"

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
                    this.setContinuousRenew(event.authCredential, () => {
                        this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
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

    secureScriptPath() {
        return this.material.secureScriptPath()
    }
    setContinuousRenew(authCredential: AuthCredential, hook: { (): void }): void {
        this.material.setContinuousRenew(storeAuthCredential(authCredential), (event) => {
            switch (event.type) {
                case "succeed-to-set-continuous-renew":
                    hook()
                    return

                default:
                    this.post(event)
            }
        })
    }
}

interface Post<T> {
    (state: T): void
}
