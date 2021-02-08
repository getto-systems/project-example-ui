import {
    mapMockPropsPasser,
    MockComponent_legacy,
    MockPropsPasser,
} from "../../../../sub/getto-example/application/mock"
import {
    FormFieldMockComponent,
    FormInputMockComponent,
} from "../../../../sub/getto-form/component/mock"

import { FormInputComponent } from "../../../../sub/getto-form/component/component"
import {
    LoginIDFieldComponent,
    LoginIDFieldState,
    LoginIDFormFieldComponent,
    LoginIDFormFieldComponentState,
} from "./component"

import { noError, hasError } from "../../../common/field/data"
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

// TODO 以下削除
export function initMockLoginIDField(state: LoginIDFieldState): LoginIDFieldMockComponent {
    return new LoginIDFieldMockComponent(state)
}

export type LoginIDFieldMockProps =
    | Readonly<{ loginIDField: "initial" }>
    | Readonly<{ loginIDField: "empty" }>

export const loginIDFieldMockTypes: ReturnType<typeof loginIDFieldMockPropsType>[] = ["initial", "empty"]
function loginIDFieldMockPropsType(props: LoginIDFieldMockProps) {
    return props.loginIDField
}

export function mapLoginIDFieldMockProps(props: LoginIDFieldMockProps): LoginIDFieldState {
    switch (props.loginIDField) {
        case "initial":
            return { type: "succeed-to-update", result: noError() }

        case "empty":
            return { type: "succeed-to-update", result: hasError(["empty"]) }
    }
}

export class LoginIDFieldMockComponent
    extends MockComponent_legacy<LoginIDFieldState>
    implements LoginIDFieldComponent {
    set(): void {
        // mock では特に何もしない
    }
    validate(): void {
        // mock では特に何もしない
    }
}
