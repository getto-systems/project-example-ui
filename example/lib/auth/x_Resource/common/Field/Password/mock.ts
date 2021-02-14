import { mapMockPropsPasser, MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"
import {
    FormFieldMockComponent,
    FormInputMockComponent,
} from "../../../../../vendor/getto-form/x_Resource/Form/mock"

import { FormInputComponent } from "../../../../../vendor/getto-form/x_Resource/Form/component"
import { PasswordFormFieldComponent, PasswordFormFieldComponentState } from "./component"

import {
    PasswordCharacter,
    PasswordValidationError,
    PasswordView,
} from "../../../../common/field/password/data"
import { FormValidationResult, markInputString } from "../../../../../vendor/getto-form/form/data"

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
