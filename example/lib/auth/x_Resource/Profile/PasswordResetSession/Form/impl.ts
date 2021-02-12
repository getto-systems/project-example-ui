import {
    PasswordResetSessionFormMaterial,
    PasswordResetSessionFormComponentFactory,
    PasswordResetSessionFormComponent,
} from "./component"

import { StartSessionFields } from "../../../../profile/passwordReset/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { FormBaseComponent } from "../../../../../sub/getto-form/x_components/Form/impl"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { initLoginIDFormFieldComponent } from "../../../common/Field/LoginID/impl"

export const initPasswordResetSessionFormComponent: PasswordResetSessionFormComponentFactory = (
    material
) => new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordResetSessionFormMaterial>
    implements PasswordResetSessionFormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(material: PasswordResetSessionFormMaterial) {
        super(material, (path) => {
            switch (path.field) {
                case "loginID":
                    return { found: true, input: this.loginID.input }

                default:
                    return { found: false }
            }
        })

        this.loginID = this.initField(
            "loginID",
            initLoginIDFormFieldComponent({ loginID: material.loginID })
        )

        this.terminateHook(() => {
            this.loginID.terminate()
        })
    }

    getStartSessionFields(): FormConvertResult<StartSessionFields> {
        this.loginID.validate()

        const result = {
            loginID: this.material.loginID.convert(),
        }
        if (!result.loginID.success) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: result.loginID.value,
            },
        }
    }
}
