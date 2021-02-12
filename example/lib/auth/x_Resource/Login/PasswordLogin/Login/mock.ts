import { MockComponent, MockPropsPasser } from "../../../../../sub/getto-example/Application/mock"

import { LoginComponent, LoginComponentState } from "./component"

type Passer = MockPropsPasser<LoginMockProps>

export type LoginMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try" }>
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockLoginComponent(passer: Passer): Component {
    return new Component(passer)
}

class Component extends MockComponent<LoginComponentState> implements LoginComponent {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: LoginMockProps): LoginComponentState {
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
    }

    submit(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
