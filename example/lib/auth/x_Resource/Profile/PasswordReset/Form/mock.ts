import { MockPropsPasser } from "../../../../../sub/getto-example/x_components/Application/mock"
import { FormMockComponent, FormMockProps } from "../../../../../sub/getto-form/x_components/Form/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../common/Field/LoginID/mock"
import { initMockPasswordFormField, PasswordFormFieldMockProps } from "../../../common/Field/Password/mock"

import { FormComponentState } from "../../../../../sub/getto-form/x_components/Form/component"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../common/Field/Password/component"
import { PasswordResetFormComponent } from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { ResetFields } from "../../../../profile/passwordReset/data"

type Passer = MockPropsPasser<PasswordResetFormMockProps>

export type PasswordResetFormMockProps = FormMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockPasswordResetForm(passer: Passer): PasswordResetFormComponent {
    return new PasswordResetFormMockComponent(passer)
}

class PasswordResetFormMockComponent extends FormMockComponent implements PasswordResetFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)

        function mapProps(props: PasswordResetFormMockProps): FormComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getResetFields(): FormConvertResult<ResetFields> {
        return { success: false }
    }
}
