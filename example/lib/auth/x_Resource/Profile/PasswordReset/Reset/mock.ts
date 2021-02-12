import { MockComponent, MockPropsPasser } from "../../../../../sub/getto-example/Application/mock"

import { ResetComponent, ResetComponentState } from "./component"

type Passer = MockPropsPasser<ResetMockProps>

export type ResetMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockResetComponent(passer: Passer): Component {
    return new Component(passer)
}

class Component extends MockComponent<ResetComponentState> implements ResetComponent {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ResetMockProps): ResetComponentState {
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
