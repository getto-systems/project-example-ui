import { MockComponent, MockPropsPasser } from "../../../../sub/getto-example/x_components/Application/mock"

import { initLoginLink } from "../EntryPoint/main/link"

import { LoginLink } from "../link"

import {
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
    PasswordResetSessionFormComponent,
} from "./component"
import { FormMockComponent, FormMockProps } from "../../../../sub/getto-form/x_components/Form/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../field/loginID/mock"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { FormComponentState } from "../../../../sub/getto-form/x_components/Form/component"
import { FormConvertResult } from "../../../../sub/getto-form/form/data"
import { StartSessionFields } from "../../../profile/passwordReset/data"

export type PasswordResetSessionMockPropsPasser = MockPropsPasser<PasswordResetSessionMockProps>

export type PasswordResetSessionMockProps = PasswordResetSessionMockProps_core &
    FormMockProps &
    LoginIDFormFieldMockProps

export function initMockPasswordResetSession(
    passer: PasswordResetSessionMockPropsPasser
): PasswordResetSessionMockComponent {
    return new PasswordResetSessionMockComponent(passer)
}

export type PasswordResetSessionMockProps_core =
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

export class PasswordResetSessionMockComponent
    extends MockComponent<PasswordResetSessionComponentState>
    implements PasswordResetSessionComponent {
    link: LoginLink

    constructor(passer: PasswordResetSessionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.link = initLoginLink()

        function mapProps(
            props: PasswordResetSessionMockProps_core
        ): PasswordResetSessionComponentState {
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
                    return {
                        type: "failed-to-start-session",
                        err: { type: "bad-response", err: props.err },
                    }

                case "infra-error":
                    return {
                        type: "failed-to-start-session",
                        err: { type: "infra-error", err: props.err },
                    }

                case "check":
                    return { type: "try-to-check-status" }

                case "waiting":
                    return {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: false },
                    }

                case "sending":
                    return {
                        type: "retry-to-check-status",
                        dest: { type: "log" },
                        status: { sending: true },
                    }

                case "check-bad-request":
                    return { type: "failed-to-check-status", err: { type: "bad-request" } }

                case "check-invalid":
                    return { type: "failed-to-check-status", err: { type: "invalid-password-reset" } }

                case "check-server-error":
                    return { type: "failed-to-check-status", err: { type: "server-error" } }

                case "check-bad-response":
                    return {
                        type: "failed-to-check-status",
                        err: { type: "bad-response", err: props.err },
                    }

                case "check-infra-error":
                    return {
                        type: "failed-to-check-status",
                        err: { type: "infra-error", err: props.err },
                    }

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
    }

    startSession(): void {
        // mock では特に何もしない
    }
}

export function initMockPasswordResetSessionForm(
    passer: PasswordResetSessionMockPropsPasser
): PasswordResetSessionFormComponent {
    return new PasswordResetSessionFormMockComponent(passer)
}

class PasswordResetSessionFormMockComponent
    extends FormMockComponent
    implements PasswordResetSessionFormComponent {
    readonly loginID: LoginIDFormFieldComponent

    constructor(passer: PasswordResetSessionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)

        function mapProps(props: PasswordResetSessionMockProps): FormComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getStartSessionFields(): FormConvertResult<StartSessionFields> {
        return { success: false }
    }
}
