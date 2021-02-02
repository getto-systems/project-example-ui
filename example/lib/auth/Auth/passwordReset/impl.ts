import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { LoginLink } from "../link"

import {
    PasswordResetComponentFactory,
    PasswordResetMaterial,
    PasswordResetComponent,
    PasswordResetState,
} from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"

export const initPasswordResetComponent: PasswordResetComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordResetState> implements PasswordResetComponent {
    material: PasswordResetMaterial

    link: LoginLink

    constructor(material: PasswordResetMaterial) {
        super()
        this.material = material
        this.link = material.link
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
