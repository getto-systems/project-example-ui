import { MockPropsPasser } from "../../../../../../../../z_getto/application/mock"

import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../../../../z_getto/getto-form/x_Resource/Form/mock"
import {
    initMockLoginIDFormField,
    LoginIDFormFieldMockProps,
} from "../../../../../../../common/x_Component/Field/LoginID/mock"

import { FormContainerComponentState } from "../../../../../../../../z_getto/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../../../../../common/x_Component/Field/LoginID/component"
import { StartPasswordResetSessionFormAction } from "./action"

import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetSessionFields } from "../../../data"

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
