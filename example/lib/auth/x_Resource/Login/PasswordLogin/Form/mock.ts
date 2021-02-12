import { MockPropsPasser } from "../../../../../sub/getto-example/Application/mock"
import { FormMockComponent, FormMockProps } from "../../../../../sub/getto-form/x_Component/Form/mock"

import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../common/Field/LoginID/mock"
import { initMockPasswordFormField, PasswordFormFieldMockProps } from "../../../common/Field/Password/mock"

import { FormContainerComponentState } from "../../../../../sub/getto-form/x_Component/Form/component"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../common/Field/Password/component"
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

        function mapProps(props: PasswordLoginFormMockProps): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getLoginFields(): FormConvertResult<LoginFields> {
        return { success: false }
    }
}
