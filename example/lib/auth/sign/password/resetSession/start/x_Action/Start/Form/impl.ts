import {
    StartPasswordResetSessionFormMaterial,
    StartPasswordResetSessionFormAction,
} from "./action"

import { PasswordResetSessionFields } from "../../../data"
import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { FormContainerBaseComponent } from "../../../../../../../../z_getto/getto-form/x_Resource/Form/impl"
import { LoginIDFormFieldComponent } from "../../../../../../../common/x_Component/Field/LoginID/component"
import { initLoginIDFormFieldComponent } from "../../../../../../../common/x_Component/Field/LoginID/impl"

export function initStartPasswordResetSessionFormAction(
    material: StartPasswordResetSessionFormMaterial
): StartPasswordResetSessionFormAction {
    return new Action(material)
}

class Action
    extends FormContainerBaseComponent<StartPasswordResetSessionFormMaterial>
    implements StartPasswordResetSessionFormAction {
    readonly loginID: LoginIDFormFieldComponent

    constructor(material: StartPasswordResetSessionFormMaterial) {
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
