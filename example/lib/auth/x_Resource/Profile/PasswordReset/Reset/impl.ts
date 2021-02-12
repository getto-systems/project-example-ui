import { ApplicationBaseComponent } from "../../../../../sub/getto-example/x_components/Application/impl"

import { LoginLink } from "../../../common/link"

import {
    PasswordResetComponentFactory,
    PasswordResetMaterial,
    PasswordResetComponent,
    PasswordResetComponentState,
} from "./component"

import { LoadError } from "../../../../common/application/data"
import { AuthCredential } from "../../../../common/credential/data"
import { storeAuthCredential } from "../../../../login/credentialStore/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { ResetFields } from "../../../../profile/passwordReset/data"

export const initPasswordResetComponent: PasswordResetComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationBaseComponent<PasswordResetComponentState>
    implements PasswordResetComponent {
    material: PasswordResetMaterial

    link: LoginLink

    constructor(material: PasswordResetMaterial) {
        super()
        this.material = material
        this.link = material.link
    }

    reset(fields: FormConvertResult<ResetFields>): void {
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
