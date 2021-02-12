import { MockPropsPasser } from "../../../../../sub/getto-example/Application/mock"

import { FormMockComponent, FormMockProps } from "../../../../../sub/getto-form/x_Component/Form/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../common/Field/LoginID/mock"

import { FormContainerComponentState } from "../../../../../sub/getto-form/x_Component/Form/component"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { PasswordResetSessionFormComponent } from "./component"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { StartSessionFields } from "../../../../profile/passwordReset/data"

type Passer = MockPropsPasser<PasswordResetSessionFormMockProps>

export type PasswordResetSessionFormMockProps = FormMockProps & LoginIDFormFieldMockProps

export function initMockPasswordResetSessionForm(passer: Passer): PasswordResetSessionFormComponent {
    return new PasswordResetSessionFormMockComponent(passer)
}

class PasswordResetSessionFormMockComponent
    extends FormMockComponent
    implements PasswordResetSessionFormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)

        function mapProps(props: PasswordResetSessionFormMockProps): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getStartSessionFields(): FormConvertResult<StartSessionFields> {
        return { success: false }
    }
}
