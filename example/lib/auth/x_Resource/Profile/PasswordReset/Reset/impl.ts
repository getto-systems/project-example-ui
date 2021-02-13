import { ApplicationBaseComponent } from "../../../../../common/getto-example/Application/impl"

import { ResetComponentFactory, ResetMaterial, ResetComponent, ResetComponentState } from "./component"

import { LoadError } from "../../../../sign/location/data"
import { AuthCredential, storeAuthCredential } from "../../../../sign/authCredential/renew/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { ResetFields } from "../../../../sign/passwordReset/data"

export const initResetComponent: ResetComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<ResetComponentState> implements ResetComponent {
    material: ResetMaterial

    constructor(material: ResetMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<ResetFields>): void {
        this.material.reset(fields, (event) => {
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
