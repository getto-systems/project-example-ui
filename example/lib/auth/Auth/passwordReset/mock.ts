import { MockComponent, MockPropsPasser } from "../../../sub/getto-example/application/mock"
import { FormMockComponent, FormMockProps } from "../../../sub/getto-form/component/mock"
import { initMockLoginIDFormField, LoginIDFormFieldMockProps } from "../field/loginID/mock"
import { initMockPasswordFormField, PasswordFormFieldMockProps } from "../field/password/mock"

import { initLoginLink } from "../Login/main/link"

import { LoginLink } from "../link"

import {
    PasswordResetComponent,
    PasswordResetComponentState,
    PasswordResetFormComponent,
} from "./component"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { PasswordFormFieldComponent } from "../field/password/component"
import { FormComponentState } from "../../../sub/getto-form/component/component"

import { FormConvertResult } from "../../../sub/getto-form/action/data"
import { ResetFields } from "../../profile/passwordReset/data"

export type PasswordResetMockPasser = MockPropsPasser<PasswordResetMockProps>

export type PasswordResetMockProps = PasswordResetMockProps_core &
    FormMockProps &
    LoginIDFormFieldMockProps &
    PasswordFormFieldMockProps

export function initMockPasswordReset(passer: PasswordResetMockPasser): PasswordResetMockComponent {
    return new PasswordResetMockComponent(passer)
}

export type PasswordResetMockProps_core =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

class PasswordResetMockComponent
    extends MockComponent<PasswordResetComponentState>
    implements PasswordResetComponent {
    link: LoginLink

    constructor(passer: PasswordResetMockPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.link = initLoginLink()

        function mapProps(props: PasswordResetMockProps): PasswordResetComponentState {
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
    }

    reset(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}

export function initMockPasswordResetForm(passer: PasswordResetMockPasser): PasswordResetFormComponent {
    return new PasswordResetFormMockComponent(passer)
}

class PasswordResetFormMockComponent extends FormMockComponent implements PasswordResetFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(passer: PasswordResetMockPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })
        this.loginID = initMockLoginIDFormField(passer)
        this.password = initMockPasswordFormField(passer)

        function mapProps(props: PasswordResetMockProps): FormComponentState {
            return { validation: props.validation, history: { undo: false, redo: false } }
        }
    }

    getResetFields(): FormConvertResult<ResetFields> {
        return { success: false }
    }
}
