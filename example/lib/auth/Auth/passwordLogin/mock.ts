import { MockComponent_legacy, MockPropsPasser } from "../../../sub/getto-example/application/mock"
import { FormMockComponent, FormMockProps } from "../../../sub/getto-form/component/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../field/loginID/mock"
import { initMockPasswordFormField, PasswordFormFieldMockProps } from "../field/password/mock"

import { initLoginLink } from "../Login/main/link"

import { LoginLink } from "../link"

import {
    PasswordLoginComponent,
    PasswordLoginFormComponent,
    PasswordLoginComponentState,
} from "./component"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { PasswordFormFieldComponent } from "../field/password/component"

import { FormConvertResult } from "../../../sub/getto-form/action/data"
import { LoginFields } from "../../login/passwordLogin/data"

export function initMockPasswordLogin(state: PasswordLoginComponentState): PasswordLoginMockComponent {
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

export function mapPasswordLoginMockProps(props: PasswordLoginMockProps): PasswordLoginComponentState {
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

class PasswordLoginMockComponent
    extends MockComponent_legacy<PasswordLoginComponentState>
    implements PasswordLoginComponent {
    link: LoginLink

    constructor(state: PasswordLoginComponentState) {
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

export type PasswordLoginMockPasser = MockPropsPasser<PasswordLoginFormMockProps>

export function initMockPasswordLoginForm(passer: PasswordLoginMockPasser): PasswordLoginFormComponent {
    return new PasswordLoginFormMockComponent(passer)
}

export type PasswordLoginFormMockProps = FormMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

class PasswordLoginFormMockComponent extends FormMockComponent implements PasswordLoginFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: PasswordLoginMockPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post({ validation: props.validation, history: { undo: false, redo: false } })
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)
    }

    getLoginFields(): FormConvertResult<LoginFields> {
        return { success: false }
    }
}
