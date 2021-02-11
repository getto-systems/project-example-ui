import { ApplicationBaseComponent } from "../../../../../sub/getto-example/x_components/Application/impl"

import { LoginLink } from "../../link"

import {
    PasswordLoginComponentFactory,
    PasswordLoginMaterial,
    PasswordLoginComponent,
    PasswordLoginComponentState,
} from "../component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { LoadError } from "../../../../common/application/data"
import { AuthCredential } from "../../../../common/credential/data"
import { storeAuthCredential } from "../../../../login/credentialStore/data"
import { LoginFields } from "../../../../login/passwordLogin/data"

export const initPasswordLoginComponent: PasswordLoginComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordLoginComponentState> implements PasswordLoginComponent {
    material: PasswordLoginMaterial

    link: LoginLink

    constructor(material: PasswordLoginMaterial) {
        super()
        this.material = material
        this.link = material.link
    }

    submit(fields: FormConvertResult<LoginFields>): void {
        this.material.login(fields, (event) => {
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
