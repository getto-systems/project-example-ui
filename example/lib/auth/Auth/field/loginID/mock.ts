import { MockComponent } from "../../../../sub/getto-example/application/mock"

import { LoginIDFieldComponent, LoginIDFieldState } from "./component"

import { noError, hasError } from "../../../common/field/data"

export function initLoginIDField(state: LoginIDFieldState): LoginIDFieldMockComponent {
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

export class LoginIDFieldStateFactory {
    noError(): LoginIDFieldState {
        return { type: "succeed-to-update", result: noError() }
    }

    empty(): LoginIDFieldState {
        return { type: "succeed-to-update", result: hasError(["empty"]) }
    }
}

export class LoginIDFieldMockComponent extends MockComponent<LoginIDFieldState>
    implements LoginIDFieldComponent {
    set(): void {
        // mock では特に何もしない
    }
    validate(): void {
        // mock では特に何もしない
    }
}
