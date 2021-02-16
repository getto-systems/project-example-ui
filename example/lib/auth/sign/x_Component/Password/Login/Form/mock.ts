import { MockPropsPasser } from "../../../../../../vendor/getto-example/Application/mock"
import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../vendor/getto-form/x_Resource/Form/mock"

import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../common/x_Component/Field/LoginID/mock"
import {
    initMockPasswordFormField,
    PasswordFormFieldMockProps,
} from "../../../../../common/x_Component/Field/Password/mock"

import { FormContainerComponentState } from "../../../../../../vendor/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../common/x_Component/Field/LoginID/component"
import { PasswordFormFieldComponent } from "../../../../../common/x_Component/Field/Password/component"
import { PasswordLoginFormComponent } from "./component"

import { FormConvertResult } from "../../../../../../vendor/getto-form/form/data"
import { PasswordLoginFields } from "../../../../password/authenticate/data"

type Passer = MockPropsPasser<PasswordLoginFormMockProps>

export type PasswordLoginFormMockProps = FormContainerMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockPasswordLoginFormComponent(passer: Passer): PasswordLoginFormComponent {
    return new Component(passer)
}

class Component extends FormContainerMockComponent implements PasswordLoginFormComponent {
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

    getLoginFields(): FormConvertResult<PasswordLoginFields> {
        return { success: false }
    }
}
