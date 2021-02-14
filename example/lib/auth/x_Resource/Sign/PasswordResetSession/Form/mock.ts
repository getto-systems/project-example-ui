import { MockPropsPasser } from "../../../../../common/getto-example/Application/mock"

import {
    FormContainerMockComponent,
    FormContainerMockProps,
} from "../../../../../common/getto-form/x_Resource/Form/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../../../common/Field/LoginID/mock"

import { FormContainerComponentState } from "../../../../../common/getto-form/x_Resource/Form/component"
import { LoginIDFormFieldComponent } from "../../../common/Field/LoginID/component"
import { FormComponent } from "./component"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { StartSessionFields } from "../../../../sign/password/reset/register/data"

type Passer = MockPropsPasser<FormMockProps>

export type FormMockProps = FormContainerMockProps & LoginIDFormFieldMockProps

export function initMockFormComponent(passer: Passer): FormComponent {
    return new Component(passer)
}

class Component extends FormContainerMockComponent implements FormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)

        function mapProps(props: FormMockProps): FormContainerComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getStartSessionFields(): FormConvertResult<StartSessionFields> {
        return { success: false }
    }
}
