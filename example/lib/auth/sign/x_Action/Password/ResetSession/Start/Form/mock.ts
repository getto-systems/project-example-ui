import { MockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"

import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../../common/vendor/getto-form/x_Resource/Form/mock"
import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../../common/x_Component/Field/LoginID/mock"

import { FormContainerComponentState } from "../../../../../../../common/vendor/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../../common/x_Component/Field/LoginID/component"
import { StartPasswordResetSessionFormAction } from "./action"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetSessionFields } from "../../../../../password/resetSession/start/data"

type Passer = MockPropsPasser<StartPasswordResetSessionFormMockProps>

export type StartPasswordResetSessionFormMockProps = FormContainerMockProps &
    LoginIDFormFieldMockProps

export function initMockStartPasswordResetSessionFormAction(
    passer: Passer
): StartPasswordResetSessionFormAction {
    return new Action(passer)
}

class Action extends FormContainerMockComponent implements StartPasswordResetSessionFormAction {
    readonly loginID: LoginIDFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)

        function mapProps(
            props: StartPasswordResetSessionFormMockProps
        ): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getStartSessionFields(): FormConvertResult<PasswordResetSessionFields> {
        return { success: false }
    }
}
