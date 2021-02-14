import { FormMaterial, FormComponentFactory, FormComponent } from "./component"

import { StartSessionFields } from "../../../../sign/password/reset/session/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { FormContainerBaseComponent } from "../../../../../common/getto-form/x_Resource/Form/impl"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { initLoginIDFormFieldComponent } from "../../../common/Field/LoginID/impl"

export const initFormComponent: FormComponentFactory = (material) => new Component(material)

class Component extends FormContainerBaseComponent<FormMaterial> implements FormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(material: FormMaterial) {
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
