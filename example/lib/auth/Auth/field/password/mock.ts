import { MockComponent } from "../../../../sub/getto-example/application/mock"

import { PasswordFieldComponent, PasswordFieldState } from "./component"

import {
    simplePassword,
    complexPassword,
    hidePassword,
    showPassword,
} from "../../../common/field/password/data"
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
                character: simplePassword,
                view: hidePassword,
            }

        case "complex":
            return {
                type: "succeed-to-update",
                result: noError(),
                character: complexPassword,
                view: hidePassword,
            }

        case "empty":
            return {
                type: "succeed-to-update",
                result: hasError(["empty"]),
                character: simplePassword,
                view: hidePassword,
            }

        case "too-long":
            return {
                type: "succeed-to-update",
                result: hasError(["too-long"]),
                character: simplePassword,
                view: hidePassword,
            }

        case "too-long-complex":
            return {
                type: "succeed-to-update",
                result: hasError(["too-long"]),
                character: complexPassword,
                view: hidePassword,
            }

        case "show":
            return {
                type: "succeed-to-update",
                result: noError(),
                character: simplePassword,
                view: showPassword(markInputValue(props.password)),
            }
    }
}

export class PasswordFieldStateFactory {
    noError(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: simplePassword,
            view: hidePassword,
        }
    }
    empty(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["empty"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    tooLong(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["too-long"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    complex_tooLong(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: hasError(["too-long"]),
            character: complexPassword,
            view: hidePassword,
        }
    }
    complex(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: complexPassword,
            view: hidePassword,
        }
    }
    show(): PasswordFieldState {
        return {
            type: "succeed-to-update",
            result: noError(),
            character: simplePassword,
            view: showPassword(markInputValue("password")),
        }
    }
}

export class PasswordFieldMockComponent extends MockComponent<PasswordFieldState>
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
