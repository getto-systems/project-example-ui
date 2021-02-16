import { ApplicationBaseAction } from "../../../../../../common/vendor/getto-example/Application/impl"

import {
    PasswordLoginMaterial,
    PasswordLoginComponent,
    PasswordLoginComponentState,
} from "./component"

import { FormConvertResult } from "../../../../../../common/vendor/getto-form/form/data"
import { LoadSecureScriptError } from "../../../../secureScriptPath/get/data"
import { PasswordLoginFields } from "../../../../password/authenticate/data"
import { AuthnInfo } from "../../../../authnInfo/common/data"

export function initPasswordLoginComponent(
    material: PasswordLoginMaterial
): PasswordLoginComponent {
    return new Component(material)
}

class Component
    extends ApplicationBaseAction<PasswordLoginComponentState>
    implements PasswordLoginComponent {
    material: PasswordLoginMaterial

    constructor(material: PasswordLoginMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordLoginFields>): void {
        this.material.login.authenticate(fields, (event) => {
            switch (event.type) {
                case "succeed-to-login":
                    this.startContinuousRenew(event.authnInfo)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(authnInfo: AuthnInfo): void {
        this.material.continuousRenew.start(authnInfo, (event) => {
            switch (event.type) {
                case "succeed-to-start-continuous-renew":
                    this.post({
                        type: "try-to-load",
                        scriptPath: this.secureScriptPath(),
                    })
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
