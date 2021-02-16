import { MockPropsPasser } from "../../../../../../../vendor/getto-example/Application/mock"

import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../../vendor/getto-form/x_Resource/Form/mock"
import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/LoginID/mock"

import { FormContainerComponentState } from "../../../../../../../vendor/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { PasswordResetSessionFormComponent } from "./component"

import { FormConvertResult } from "../../../../../../../vendor/getto-form/form/data"
import { PasswordResetSessionFields } from "../../../../../password/resetSession/start/data"

type Passer = MockPropsPasser<PasswordResetSessionFormMockProps>

export type PasswordResetSessionFormMockProps = FormContainerMockProps & LoginIDFormFieldMockProps

export function initMockPasswordResetSessionFormComponent(
    passer: Passer
): PasswordResetSessionFormComponent {
    return new Component(passer)
}

class Component extends FormContainerMockComponent implements PasswordResetSessionFormComponent {
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

    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields> {
        return { success: false }
    }
}
