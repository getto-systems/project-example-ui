import { ApplicationBaseComponent } from "../../../../../vendor/getto-example/Application/impl"

import { ResetComponentFactory, ResetMaterial, ResetComponent, ResetComponentState } from "./component"

import { LoadError } from "../../../../sign/location/data"
import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { ResetFields } from "../../../../sign/password/reset/register/data"
import { AuthCredential } from "../../../../sign/authCredential/common/data"

export const initResetComponent: ResetComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<ResetComponentState> implements ResetComponent {
    material: ResetMaterial

    constructor(material: ResetMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<ResetFields>): void {
        this.material.register.submit(fields, (event) => {
            switch (event.type) {
                case "succeed-to-reset":
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
        return this.material.location.getSecureScriptPath()
    }
}
