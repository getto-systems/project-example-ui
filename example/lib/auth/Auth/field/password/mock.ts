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
    PasswordFieldComponent,
    PasswordFieldState,
    PasswordFormFieldComponent,
    PasswordFormFieldComponentState,
} from "./component"

import {
    PasswordCharacter,
    PasswordValidationError,
    PasswordView,
    showPassword,
} from "../../../common/field/password/data"
import { markInputValue, noError, hasError } from "../../../common/field/data"
import { FormValidationResult, markInputString } from "../../../../sub/getto-form/action/data"

export function initMockPasswordFormField(
    passer: MockPropsPasser<PasswordFormFieldMockProps>
): PasswordFormFieldComponent {
    return new PasswordFormFieldMockComponent(passer)
}

class PasswordFormFieldMockComponent
    extends FormFieldMockComponent<PasswordFormFieldComponentState, PasswordValidationError>
    implements PasswordFormFieldComponent {
    input: FormInputComponent

    constructor(passer: MockPropsPasser<PasswordFormFieldMockProps>) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.input = new FormInputMockComponent(
            mapMockPropsPasser(passer, (props) => ({ input: props.password }))
        )

        function mapProps(props: PasswordFormFieldMockProps): PasswordFormFieldComponentState {
            return {
                result: validation(props.passwordValidation),
                character: character(props.passwordCharacter),
                view: view(props.passwordView),
            }
            function validation(
                state: PasswordFormFieldValidation
            ): FormValidationResult<PasswordValidationError> {
                switch (state) {
                    case "ok":
                        return { valid: true }

                    case "empty":
                    case "too-long":
                        return { valid: false, err: [state] }
                }
            }
            function character(state: PasswordFormFieldCharacter): PasswordCharacter {
                switch (state) {
                    case "simple":
                        return { complex: false }

                    case "complex":
                        return { complex: true }
                }
            }
            function view(state: PasswordFormFieldView): PasswordView {
                switch (state) {
                    case "hide":
                        return { show: false }

                    case "show":
                        return { show: true, password: markInputString(props.password) }
                }
            }
        }
    }

    show(): void {
        // mock では特に何もしない
    }
    hide(): void {
        // mock では特に何もしない
    }
}

export type PasswordFormFieldMockProps = Readonly<{
    password: string
    passwordValidation: PasswordFormFieldValidation
    passwordCharacter: PasswordFormFieldCharacter
    passwordView: PasswordFormFieldView
}>

export type PasswordFormFieldValidation = "ok" | "empty" | "too-long"
export type PasswordFormFieldCharacter = "simple" | "complex"
export type PasswordFormFieldView = "show" | "hide"

export const passwordFormFieldValidations: PasswordFormFieldValidation[] = ["ok", "empty", "too-long"]
export const passwordFormFieldCharacters: PasswordFormFieldCharacter[] = ["simple", "complex"]
export const passwordFormFieldViews: PasswordFormFieldView[] = ["hide", "show"]

// TODO 以下削除
export function initMockPasswordField(state: PasswordFieldState): PasswordFieldMockComponent {
    return new PasswordFieldMockComponent(state)
}

export type PasswordFieldMockProps =
    | Readonly<{ passwordField: "initial" }>
    | Readonly<{ passwordField: "complex" }>
    | Readonly<{ passwordField: "empty" }>
    | Readonly<{ passwordField: "too-long" }>
    | Readonly<{ passwordField: "too-long-complex" }>
    | Readonly<{ passwordField: "show"; password: string }>

export const passwordFieldMockTypes: ReturnType<typeof passwordFieldMockPropsType>[] = [
    "initial",
    "complex",
    "empty",
    "too-long",
    "too-long-complex",
    "show",
]
function passwordFieldMockPropsType(props: PasswordFieldMockProps) {
    return props.passwordField
}

export function mapPasswordFieldMockProps(props: PasswordFieldMockProps): PasswordFieldState {
    switch (props.passwordField) {
        case "initial":
            return {
                type: "succeed-to-update",
                result: noError(),
                character: { complex: false },
                view: { show: false },
            }

        case "complex":
            return {
                type: "succeed-to-update",
                result: noError(),
                character: { complex: true },
                view: { show: false },
            }

        case "empty":
            return {
                type: "succeed-to-update",
                result: hasError(["empty"]),
                character: { complex: false },
                view: { show: false },
            }

        case "too-long":
            return {
                type: "succeed-to-update",
                result: hasError(["too-long"]),
                character: { complex: false },
                view: { show: false },
            }

        case "too-long-complex":
            return {
                type: "succeed-to-update",
                result: hasError(["too-long"]),
                character: { complex: true },
                view: { show: false },
            }

        case "show":
            return {
                type: "succeed-to-update",
                result: noError(),
                character: { complex: false },
                view: showPassword(markInputValue(props.password)),
            }
    }
}

export class PasswordFieldMockComponent
    extends MockComponent_legacy<PasswordFieldState>
    implements PasswordFieldComponent {
    set(): void {
        // mock では特に何もしない
    }
    show(): void {
        // mock では特に何もしない
    }
    hide(): void {
        // mock では特に何もしない
    }
    validate(): void {
        // mock では特に何もしない
    }
}
