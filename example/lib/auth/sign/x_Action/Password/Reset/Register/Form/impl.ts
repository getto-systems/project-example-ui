import { FormContainerBaseComponent } from "../../../../../../../common/vendor/getto-form/x_Resource/Form/impl"
import { initLoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/impl"
import { initPasswordFormFieldComponent } from "../../../../../../common/x_Component/Field/Password/impl"

import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../../../../common/x_Component/Field/Password/component"
import {
    RegisterPasswordResetSessionFormAction,
    RegisterPasswordResetSessionFormMaterial,
} from "./action"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"

export function initRegisterPasswordResetSessionFormAction(
    material: RegisterPasswordResetSessionFormMaterial
): RegisterPasswordResetSessionFormAction {
    return new Action(material)
}

class Action
    extends FormContainerBaseComponent<RegisterPasswordResetSessionFormMaterial>
    implements RegisterPasswordResetSessionFormAction {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(material: RegisterPasswordResetSessionFormMaterial) {
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

    getResetFields(): FormConvertResult<PasswordResetFields> {
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
