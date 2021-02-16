import { ApplicationBaseAction } from "../../../../../../../common/vendor/getto-example/Application/impl"

import {
    PasswordResetRegisterMaterial,
    PasswordResetRegisterComponent,
    PasswordResetRegisterComponentState,
} from "./component"

import { LoadSecureScriptError } from "../../../../../secureScriptPath/get/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import { AuthCredential } from "../../../../../authCredential/common/data"

export function initPasswordResetRegisterComponent(
    material: PasswordResetRegisterMaterial
): PasswordResetRegisterComponent {
    return new Component(material)
}

class Component
    extends ApplicationBaseAction<PasswordResetRegisterComponentState>
    implements PasswordResetRegisterComponent {
    material: PasswordResetRegisterMaterial

    constructor(material: PasswordResetRegisterMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordResetFields>): void {
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

    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.location.get()
    }
}
