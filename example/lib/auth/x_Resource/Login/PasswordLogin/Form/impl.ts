import { FormBaseComponent } from "../../../../../sub/getto-form/x_components/Form/impl"
import { initLoginIDFormFieldComponent } from "../../../Field/LoginID/impl"
import { initPasswordFormFieldComponent } from "../../../Field/Password/impl"

import { LoginIDFormFieldComponent } from "../../../Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../Field/Password/component"
import {
    PasswordLoginFormComponentFactory,
    PasswordLoginFormComponent,
    PasswordLoginFormMaterial,
} from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { LoginFields } from "../../../../login/passwordLogin/data"

export const initPasswordLoginFormComponent: PasswordLoginFormComponentFactory = (material) =>
    new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordLoginFormMaterial>
    implements PasswordLoginFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(material: PasswordLoginFormMaterial) {
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
                character: material.character,
                viewer: material.viewer,
            })
        )

        this.terminateHook(() => {
            this.loginID.terminate()
            this.password.terminate()
        })
    }

    getLoginFields(): FormConvertResult<LoginFields> {
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
