import { MockPropsPasser } from "../../../../../../../z_getto/application/mock"
import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../../z_getto/getto-form/x_Resource/Form/mock"
import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/LoginID/mock"
import {
    initMockPasswordFormField,
    PasswordFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/Password/mock"

import { FormContainerComponentState } from "../../../../../../../z_getto/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../../../../common/x_Component/Field/Password/component"
import { RegisterPasswordFormAction } from "./action"

import { FormConvertResult } from "../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"

type Passer = MockPropsPasser<RegisterPasswordFormMockProps>

export type RegisterPasswordFormMockProps = FormContainerMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockRegisterPasswordFormAction(
    passer: Passer
): RegisterPasswordFormAction {
    return new Component(passer)
}

class Component extends FormContainerMockComponent implements RegisterPasswordFormAction {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)

        function mapProps(
            props: RegisterPasswordFormMockProps
        ): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getResetFields(): FormConvertResult<PasswordResetFields> {
        return { success: false }
    }
}
