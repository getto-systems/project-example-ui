import { PasswordResetMaterial, PasswordResetComponent, PasswordResetState } from "./component"

import { LoadError } from "../../common/application/data"
import { LoginLink } from "../link"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"

export function initPasswordReset(material: PasswordResetMaterial): PasswordResetComponent {
    return new Component(material)
}

class Component implements PasswordResetComponent {
    material: PasswordResetMaterial

    listener: Post<PasswordResetState>[] = []

    link: LoginLink

    constructor(material: PasswordResetMaterial) {
        this.material = material
        this.link = material.link
    }

    onStateChange(post: Post<PasswordResetState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetState): void {
        this.listener.forEach((post) => post(state))
    }

    reset(): void {
        this.material.reset((event) => {
            switch (event.type) {
                case "succeed-to-reset":
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
                    return
            }
        })
    }
}

interface Post<T> {
    (state: T): void
}
