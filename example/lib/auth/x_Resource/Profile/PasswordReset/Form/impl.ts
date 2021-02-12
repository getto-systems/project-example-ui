import { FormBaseComponent } from "../../../../../sub/getto-form/x_Component/Form/impl"
import { initLoginIDFormFieldComponent } from "../../../common/Field/LoginID/impl"
import { initPasswordFormFieldComponent } from "../../../common/Field/Password/impl"

import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../common/Field/Password/component"
import {
    PasswordResetFormComponent,
    PasswordResetFormComponentFactory,
    PasswordResetFormMaterial,
} from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { ResetFields } from "../../../../profile/passwordReset/data"

export const initPasswordResetFormComponent: PasswordResetFormComponentFactory = (material) =>
    new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordResetFormMaterial>
    implements PasswordResetFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(material: PasswordResetFormMaterial) {
        super(material, (path) => {
            switch (path.field) {
                case "loginID":
                    return { found: true, input: this.loginID.input }

                case "password":
                    return { found: true, input: this.password.input }

                default:
                    return { found: false }
            }
        })

        this.loginID = this.initField(
            "loginID",
            initLoginIDFormFieldComponent({ loginID: material.loginID })
        )
        this.password = this.initField(
            "password",
            initPasswordFormFieldComponent({
                password: material.password,
                character: material.character,
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
