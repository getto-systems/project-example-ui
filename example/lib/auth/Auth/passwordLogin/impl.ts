import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { LoginLink } from "../link"

import {
    PasswordLoginComponentFactory,
    PasswordLoginMaterial,
    PasswordLoginComponent,
    PasswordLoginState,
} from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"

export const initPasswordLoginComponent: PasswordLoginComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordLoginState> implements PasswordLoginComponent {
    material: PasswordLoginMaterial

    link: LoginLink

    constructor(material: PasswordLoginMaterial) {
        super()
        this.material = material
        this.link = material.link
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
                    return
            }
        })
    }
}
