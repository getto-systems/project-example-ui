import { MockComponent } from "../../../z_external/mock/component"

import { initLoginLink } from "../Login/main/link"

import { LoginLink } from "../link"

import { PasswordResetSessionComponent, PasswordResetSessionState } from "./component"

export function initPasswordResetSession(
    state: PasswordResetSessionState
): PasswordResetSessionMockComponent {
    return new PasswordResetSessionMockComponent(state)
}

export type PasswordResetSessionMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
    | Readonly<{ type: "check" }>
    | Readonly<{ type: "waiting" }>
    | Readonly<{ type: "sending" }>
    | Readonly<{ type: "check-bad-request" }>
    | Readonly<{ type: "check-invalid" }>
    | Readonly<{ type: "check-server-error" }>
    | Readonly<{ type: "check-bad-response"; err: string }>
    | Readonly<{ type: "check-infra-error"; err: string }>
    | Readonly<{ type: "send-error"; err: string }>
    | Readonly<{ type: "send" }>

export function mapPasswordResetSessionMockProps(
    props: PasswordResetSessionMockProps
): PasswordResetSessionState {
    switch (props.type) {
        case "initial":
            return { type: "initial-reset-session" }

        case "try":
            return { type: "try-to-start-session" }

        case "delayed":
            return { type: "delayed-to-start-session" }

        case "validation-error":
            return { type: "failed-to-start-session", err: { type: "validation-error" } }

        case "bad-request":
            return { type: "failed-to-start-session", err: { type: "bad-request" } }

        case "invalid":
            return { type: "failed-to-start-session", err: { type: "invalid-password-reset" } }

        case "server-error":
            return { type: "failed-to-start-session", err: { type: "server-error" } }

        case "bad-response":
            return { type: "failed-to-start-session", err: { type: "bad-response", err: props.err } }

        case "infra-error":
            return { type: "failed-to-start-session", err: { type: "infra-error", err: props.err } }

        case "check":
            return { type: "try-to-check-status" }

        case "waiting":
            return { type: "retry-to-check-status", dest: { type: "log" }, status: { sending: false } }

        case "sending":
            return { type: "retry-to-check-status", dest: { type: "log" }, status: { sending: true } }

        case "check-bad-request":
            return { type: "failed-to-check-status", err: { type: "bad-request" } }

        case "check-invalid":
            return { type: "failed-to-check-status", err: { type: "invalid-password-reset" } }

        case "check-server-error":
            return { type: "failed-to-check-status", err: { type: "server-error" } }

        case "check-bad-response":
            return { type: "failed-to-check-status", err: { type: "bad-response", err: props.err } }

        case "check-infra-error":
            return { type: "failed-to-check-status", err: { type: "infra-error", err: props.err } }

        case "send-error":
            // TODO log 以外に対応したら type を props から取得するように
            return {
                type: "failed-to-send-token",
                dest: { type: "log" },
                err: { type: "infra-error", err: props.err },
            }

        case "send":
            // TODO log 以外に対応したら type を props から取得するように
            return { type: "succeed-to-send-token", dest: { type: "log" } }
    }
}

export class PasswordResetSessionMockComponent extends MockComponent<PasswordResetSessionState>
    implements PasswordResetSessionComponent {
    link: LoginLink

    constructor(state: PasswordResetSessionState) {
        super(state)
        this.link = initLoginLink()
    }

    startSession(): void {
        // mock では特に何もしない
    }
}
