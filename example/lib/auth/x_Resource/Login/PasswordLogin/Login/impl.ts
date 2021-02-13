import { ApplicationBaseComponent } from "../../../../../common/getto-example/Application/impl"

import { LoginComponentFactory, LoginMaterial, LoginComponent, LoginComponentState } from "./component"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { LoadError } from "../../../../common/application/data"
import { AuthCredential } from "../../../../common/credential/data"
import { storeAuthCredential } from "../../../../login/credentialStore/data"
import { LoginFields } from "../../../../login/passwordLogin/data"

export const initLoginComponent: LoginComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<LoginComponentState> implements LoginComponent {
    material: LoginMaterial

    constructor(material: LoginMaterial) {
        super()
        this.material = material
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
