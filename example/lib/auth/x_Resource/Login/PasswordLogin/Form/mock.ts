import { MockPropsPasser } from "../../../../../sub/getto-example/x_components/Application/mock"
import { FormMockComponent, FormMockProps } from "../../../../../sub/getto-form/x_components/Form/mock"

import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../Field/LoginID/mock"
import { initMockPasswordFormField, PasswordFormFieldMockProps } from "../../../Field/Password/mock"

import { FormComponentState } from "../../../../../sub/getto-form/x_components/Form/component"
import { LoginIDFormFieldComponent } from "../../../Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../Field/Password/component"
import { PasswordLoginFormComponent } from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { LoginFields } from "../../../../login/passwordLogin/data"

type Passer = MockPropsPasser<PasswordLoginFormMockProps>

export type PasswordLoginFormMockProps = FormMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockPasswordLoginForm(passer: Passer): PasswordLoginFormComponent {
    return new PasswordLoginFormMockComponent(passer)
}

class PasswordLoginFormMockComponent extends FormMockComponent implements PasswordLoginFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)

        function mapProps(props: PasswordLoginFormMockProps): FormComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getLoginFields(): FormConvertResult<LoginFields> {
        return { success: false }
    }
}
