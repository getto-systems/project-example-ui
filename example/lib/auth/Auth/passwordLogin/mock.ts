import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initLoginLink } from "../Login/main/link"

import { LoginLink } from "../link"

import {
    FormState,
    FormFieldState,
    FormFieldEmptyState,
    FormInputComponent,
    FormInputState,
} from "../../../sub/getto-form/component/component"
import { PasswordLoginComponent, PasswordLoginFormComponent, PasswordLoginState } from "./component"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { PasswordFormFieldComponent, PasswordFormFieldState } from "../field/password/component"

import { FormConvertResult, FormInputString, markInputString } from "../../../sub/getto-form/data"
import { LoginFields } from "../../login/passwordLogin/data"
import { LoginIDValidationError } from "../../common/field/loginID/data"
import { FormHistory } from "../../../sub/getto-form/action/data"

// TODO initMockPasswordLogin にする
export function initPasswordLogin(state: PasswordLoginState): PasswordLoginMockComponent {
    return new PasswordLoginMockComponent(state)
}

export type PasswordLoginMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapPasswordLoginMockProps(props: PasswordLoginMockProps): PasswordLoginState {
    switch (props.type) {
        case "initial":
            return { type: "initial-login" }

        case "try":
            return { type: "try-to-login" }

        case "delayed":
            return { type: "delayed-to-login" }

        case "validation-error":
            return { type: "failed-to-login", err: { type: "validation-error" } }

        case "bad-request":
            return { type: "failed-to-login", err: { type: "bad-request" } }

        case "invalid":
            return { type: "failed-to-login", err: { type: "invalid-password-login" } }

        case "server-error":
            return { type: "failed-to-login", err: { type: "server-error" } }

        case "bad-response":
            return { type: "failed-to-login", err: { type: "bad-response", err: props.err } }

        case "infra-error":
            return { type: "failed-to-login", err: { type: "infra-error", err: props.err } }
    }
}

export class PasswordLoginMockComponent
    extends MockComponent<PasswordLoginState>
    implements PasswordLoginComponent {
    link: LoginLink

    constructor(state: PasswordLoginState) {
        super(state)
        this.link = initLoginLink()
    }

    login(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}

export function initMockPasswordLoginForm(state: FormState): PasswordLoginFormMockComponent {
    return new PasswordLoginFormMockComponent(state)
}

export type PasswordLoginFormMockProps = Readonly<{ type: "initial" }>

export function mapPasswordLoginFormMockProps(props: PasswordLoginFormMockProps): FormState {
    // TODO field の状態も update したい・・・
    switch (props.type) {
        case "initial":
            return { validation: "initial", history: { undo: false, redo: false } }
    }
}

export class PasswordLoginFormMockComponent
    extends MockComponent<FormState>
    implements PasswordLoginFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(state: FormState) {
        super(state)
        this.loginID = new LoginIDFormFieldMockComponent()
        this.password = new PasswordFormFieldMockComponent()
    }

    getLoginFields(): FormConvertResult<LoginFields> {
        return { success: false }
    }
}

export class LoginIDFormFieldMockComponent
    extends MockComponent<FormFieldState<FormFieldEmptyState, LoginIDValidationError>>
    implements LoginIDFormFieldComponent {
    input: FormInputComponent

    constructor() {
        super({ result: { valid: true } })
        this.input = new LoginIDFormInputMockComponent()
    }

    validate(): void {
        // mock では特に何もしない
    }
}

export class LoginIDFormInputMockComponent
    extends MockComponent<FormInputState>
    implements FormInputComponent {
    constructor() {
        super({ value: markInputString("") })
    }

    input(_value: FormInputString): void {
        // mock では特に何もしない
    }
    change(): void {
        // mock では特に何もしない
    }
    restore(_history: FormHistory): void {
        // mock では特に何もしない
    }
}

export class PasswordFormFieldMockComponent
    extends MockComponent<PasswordFormFieldState>
    implements PasswordFormFieldComponent {
    input: FormInputComponent

    constructor() {
        super({ result: { valid: true }, character: { complex: false }, view: { show: false } })
        this.input = new LoginIDFormInputMockComponent()
    }

    validate(): void {
        // mock では特に何もしない
    }
    show(): void {
        // mock では特に何もしない
    }
    hide(): void {
        // mock では特に何もしない
    }
}

export class PasswordFormInputMockComponent
    extends MockComponent<FormInputState>
    implements FormInputComponent {
    constructor() {
        super({ value: markInputString("") })
    }

    input(_value: FormInputString): void {
        // mock では特に何もしない
    }
    change(): void {
        // mock では特に何もしない
    }
    restore(_history: FormHistory): void {
        // mock では特に何もしない
    }
}
