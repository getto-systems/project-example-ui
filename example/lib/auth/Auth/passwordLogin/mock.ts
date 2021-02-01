import { MockComponent } from "../../../sub/getto-example/component/mock"

import { initLoginLink } from "../Login/main/link"

import { LoginLink } from "../link"

import { PasswordLoginComponent, PasswordLoginState } from "./component"

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

export class PasswordLoginMockComponent extends MockComponent<PasswordLoginState>
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
