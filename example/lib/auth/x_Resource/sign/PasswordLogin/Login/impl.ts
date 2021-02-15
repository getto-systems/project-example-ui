import { ApplicationBaseComponent } from "../../../../../vendor/getto-example/Application/impl"

import { LoginComponentFactory, LoginMaterial, LoginComponent, LoginComponentState } from "./component"

import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { LoadSecureScriptError } from "../../../../sign/authLocation/data"
import { PasswordLoginFields } from "../../../../sign/password/login/data"
import { AuthCredential } from "../../../../sign/authCredential/common/data"

export const initLoginComponent: LoginComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<LoginComponentState> implements LoginComponent {
    material: LoginMaterial

    constructor(material: LoginMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordLoginFields>): void {
        this.material.login.submit(fields, (event) => {
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

    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.location.getSecureScriptPath()
    }
}
