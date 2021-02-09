import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"
import { FormBaseComponent } from "../../../sub/getto-form/component/impl"
import { initLoginIDFormFieldComponent } from "../field/loginID/impl"
import { initPasswordFormFieldComponent } from "../field/password/impl"

import { LoginLink } from "../link"

import {
    PasswordResetComponentFactory,
    PasswordResetMaterial,
    PasswordResetComponent,
    PasswordResetComponentState,
    PasswordResetFormComponentFactory,
    PasswordResetFormMaterial,
    PasswordResetFormComponent,
} from "./component"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { PasswordFormFieldComponent } from "../field/password/component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"
import { FormConvertResult } from "../../../sub/getto-form/action/data"
import { ResetFields } from "../../profile/passwordReset/data"

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

export const initPasswordResetFormComponent: PasswordResetFormComponentFactory = (material) =>
    new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordResetFormMaterial>
    implements PasswordResetFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(material: PasswordResetFormMaterial) {
        super(material, {
            findFieldInput: (path) => {
                switch (path.field) {
                    case "loginID":
                        return { found: true, input: this.loginID.input }

                    case "password":
                        return { found: true, input: this.password.input }

                    default:
                        return { found: false }
                }
            },
        })

        this.loginID = this.initField(
            "loginID",
            initLoginIDFormFieldComponent({ loginID: material.loginID })
        )
        this.password = this.initField(
            "password",
            initPasswordFormFieldComponent({
                password: material.password,
                checker: material.checker,
                viewer: material.viewer,
            })
        )

        this.terminateHook(() => {
            this.loginID.terminate()
            this.password.terminate()
        })
    }

    getResetFields(): FormConvertResult<ResetFields> {
        this.loginID.validate()
        this.password.validate()

        const result = {
            loginID: this.material.loginID.convert(),
            password: this.material.password.convert(),
        }
        if (!result.loginID.success || !result.password.success) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: result.loginID.value,
                password: result.password.value,
            },
        }
    }
}
