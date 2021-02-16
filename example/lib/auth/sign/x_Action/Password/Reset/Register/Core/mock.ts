import {
    MockAction,
    MockPropsPasser,
} from "../../../../../../../common/vendor/getto-example/Application/mock"

import {
    RegisterPasswordResetSessionAction,
    RegisterPasswordResetSessionActionState,
} from "./action"

type Passer = MockPropsPasser<RegisterPasswordResetSessionMockProps>

export type RegisterPasswordResetSessionMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockRegisterPasswordResetSessionAction(passer: Passer): Action {
    return new Action(passer)
}

class Action
    extends MockAction<RegisterPasswordResetSessionActionState>
    implements RegisterPasswordResetSessionAction {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(
            props: RegisterPasswordResetSessionMockProps
        ): RegisterPasswordResetSessionActionState {
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
                    return {
                        type: "failed-to-reset",
                        err: { type: "invalid-password-reset" },
                    }

                case "server-error":
                    return { type: "failed-to-reset", err: { type: "server-error" } }

                case "bad-response":
                    return {
                        type: "failed-to-reset",
                        err: { type: "bad-response", err: props.err },
                    }

                case "infra-error":
                    return {
                        type: "failed-to-reset",
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
