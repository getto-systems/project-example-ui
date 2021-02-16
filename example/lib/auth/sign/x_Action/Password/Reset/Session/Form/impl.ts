import { PasswordResetSessionFormMaterial, PasswordResetSessionFormComponent } from "./component"

import { PasswordResetSessionFields } from "../../../../../password/resetSession/start/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { FormContainerBaseComponent } from "../../../../../../../common/vendor/getto-form/x_Resource/Form/impl"
import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { initLoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/impl"

export function initPasswordResetSessionFormComponent(
    material: PasswordResetSessionFormMaterial
): PasswordResetSessionFormComponent {
    return new Component(material)
}

class Component
    extends FormContainerBaseComponent<PasswordResetSessionFormMaterial>
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

    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields> {
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
