import { ApplicationBaseComponent } from "../../../../../common/getto-example/Application/impl"

import { LoginComponentFactory, LoginMaterial, LoginComponent, LoginComponentState } from "./component"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { LoadError } from "../../../../sign/location/data"
import { LoginFields } from "../../../../sign/passwordLogin/data"
import { AuthCredential } from "../../../../sign/authCredential/common/data"

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
                    this.startContinuousRenew(event.authCredential)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(authCredential: AuthCredential): void {
        this.material.continuousRenew.start(authCredential, (event) => {
            switch (event.type) {
                case "succeed-to-start-continuous-renew":
                    this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
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
}
