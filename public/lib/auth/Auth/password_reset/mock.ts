import { MockComponent } from "../../../z_external/mock/component"

import { initLoginLink } from "../Login/impl/link"

import { LoginLink } from "../link"

import { PasswordResetComponent, PasswordResetState } from "./component"

export function initPasswordReset(state: PasswordResetState): PasswordResetMockComponent {
    return new PasswordResetMockComponent(state)
}

export type PasswordResetMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapPasswordResetMockProps(props: PasswordResetMockProps): PasswordResetState {
    switch (props.type) {
        case "initial":
            return { type: "initial-reset" }

        case "try":
            return { type: "try-to-reset" }

        case "delayed":
            return { type: "delayed-to-reset" }

        case "validation-error":
            return { type: "failed-to-reset", err: { type: "validation-error" } }

        case "bad-request":
            return { type: "failed-to-reset", err: { type: "bad-request" } }

        case "invalid":
            return { type: "failed-to-reset", err: { type: "invalid-password-reset" } }

        case "server-error":
            return { type: "failed-to-reset", err: { type: "server-error" } }

        case "bad-response":
            return { type: "failed-to-reset", err: { type: "bad-response", err: props.err } }

        case "infra-error":
            return { type: "failed-to-reset", err: { type: "infra-error", err: props.err } }
    }
}

export class PasswordResetMockComponent extends MockComponent<PasswordResetState>
    implements PasswordResetComponent {
    link: LoginLink

    constructor(state: PasswordResetState) {
        super(state)
        this.link = initLoginLink()
    }

    reset(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
