import { MockPropsPasser } from "../../../../../sub/getto-example/Application/mock"
import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../sub/getto-form/x_Component/Form/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../common/Field/LoginID/mock"
import {
    initMockPasswordFormField,
    PasswordFormFieldMockProps,
} from "../../../common/Field/Password/mock"

import { FormContainerComponentState } from "../../../../../sub/getto-form/x_Component/Form/component"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../common/Field/Password/component"
import { FormComponent } from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { ResetFields } from "../../../../profile/passwordReset/data"

type Passer = MockPropsPasser<FormMockProps>

export type FormMockProps = FormContainerMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockFormComponent(passer: Passer): FormComponent {
    return new Component(passer)
}

class Component extends FormContainerMockComponent implements FormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)

        function mapProps(props: FormMockProps): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getResetFields(): FormConvertResult<ResetFields> {
        return { success: false }
    }
}
