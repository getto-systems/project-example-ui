import {
    MockComponent,
    MockPropsPasser,
} from "../../../../../sub/getto-example/x_components/Application/mock"

import { initLoginLink } from "../../../common/impl/link"

import { LoginLink } from "../../../common/link"

import { PasswordResetComponent, PasswordResetComponentState } from "./component"

type Passer = MockPropsPasser<PasswordResetMockProps>

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

export function initMockPasswordReset(passer: Passer): PasswordResetMockComponent {
    return new PasswordResetMockComponent(passer)
}

class PasswordResetMockComponent
    extends MockComponent<PasswordResetComponentState>
    implements PasswordResetComponent {
    link: LoginLink

    constructor(passer: Passer) {
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
