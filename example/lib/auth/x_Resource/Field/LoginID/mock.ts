import { mapMockPropsPasser, MockPropsPasser } from "../../../../sub/getto-example/x_components/Application/mock"
import {
    FormFieldMockComponent,
    FormInputMockComponent,
} from "../../../../sub/getto-form/x_components/Form/mock"

import { FormInputComponent } from "../../../../sub/getto-form/x_components/Form/component"
import { LoginIDFormFieldComponent, LoginIDFormFieldComponentState } from "./component"

import { LoginIDValidationError } from "../../../common/field/loginID/data"

export function initMockLoginIDFormField(
    passer: MockPropsPasser<LoginIDFormFieldMockProps>
): LoginIDFormFieldComponent {
    return new LoginIDFormFieldMockComponent(passer)
}

class LoginIDFormFieldMockComponent
    extends FormFieldMockComponent<LoginIDFormFieldComponentState, LoginIDValidationError>
    implements LoginIDFormFieldComponent {
    input: FormInputComponent

    constructor(passer: MockPropsPasser<LoginIDFormFieldMockProps>) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.input = new FormInputMockComponent(
            mapMockPropsPasser(passer, (props) => ({ input: props.loginID }))
        )

        function mapProps({
            loginIDValidation: validation,
        }: LoginIDFormFieldMockProps): LoginIDFormFieldComponentState {
            switch (validation) {
                case "ok":
                    return { result: { valid: true } }

                case "empty":
                    return { result: { valid: false, err: ["empty"] } }
            }
        }
    }
}

export type LoginIDFormFieldMockProps = Readonly<{
    loginID: string
    loginIDValidation: LoginIDFormFieldValidation
}>
export type LoginIDFormFieldValidation = "ok" | "empty"
export const loginIDFormFieldValidations: LoginIDFormFieldValidation[] = ["ok", "empty"]
