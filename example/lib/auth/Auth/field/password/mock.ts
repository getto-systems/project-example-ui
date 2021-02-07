import { MockComponent } from "../../../../sub/getto-example/application/mock"

import { PasswordFieldComponent, PasswordFieldState } from "./component"

import { showPassword } from "../../../common/field/password/data"
import { markInputValue, noError, hasError } from "../../../common/field/data"

export function initPasswordField(state: PasswordFieldState): PasswordFieldMockComponent {
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
    extends MockComponent<PasswordFieldState>
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
