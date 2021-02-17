import { MockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"
import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../../common/vendor/getto-form/x_Resource/Form/mock"

import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/LoginID/mock"
import {
    initMockPasswordFormField,
    PasswordFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/Password/mock"

import { FormContainerComponentState } from "../../../../../../../common/vendor/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../../../../common/x_Component/Field/Password/component"
import { AuthenticatePasswordFormAction } from "./action"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { AuthenticatePasswordFields } from "../../../data"

type Passer = MockPropsPasser<AuthenticatePasswordFormMockProps>

export type AuthenticatePasswordFormMockProps = FormContainerMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockAuthenticatePasswordFormAction(
    passer: Passer
): AuthenticatePasswordFormAction {
    return new Action(passer)
}

class Action
    extends FormContainerMockComponent
    implements AuthenticatePasswordFormAction {
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
            props: AuthenticatePasswordFormMockProps
        ): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getLoginFields(): FormConvertResult<AuthenticatePasswordFields> {
        return { success: false }
    }
}
