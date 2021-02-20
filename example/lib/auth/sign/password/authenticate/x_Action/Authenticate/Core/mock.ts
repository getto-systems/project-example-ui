import {
    MockAction,
    MockPropsPasser,
} from "../../../../../../../z_getto/application/mock"

import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreState } from "./action"

type Passer = MockPropsPasser<AuthenticatePasswordCoreMockProps>

export type AuthenticatePasswordCoreMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockAuthenticatePasswordCoreAction(
    passer: Passer
): AuthenticatePasswordCoreAction {
    return new Action(passer)
}

class Action
    extends MockAction<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: AuthenticatePasswordCoreMockProps): AuthenticatePasswordCoreState {
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
                    return {
                        type: "failed-to-login",
                        err: { type: "invalid-password-login" },
                    }

                case "server-error":
                    return { type: "failed-to-login", err: { type: "server-error" } }

                case "bad-response":
                    return {
                        type: "failed-to-login",
                        err: { type: "bad-response", err: props.err },
                    }

                case "infra-error":
                    return {
                        type: "failed-to-login",
                        err: { type: "infra-error", err: props.err },
                    }
            }
        }
    }

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
