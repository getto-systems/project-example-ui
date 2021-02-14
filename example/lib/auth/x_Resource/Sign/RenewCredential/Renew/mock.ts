import { MockComponent, MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"

import { RenewComponent, RenewComponentState } from "./component"

type Passer = MockPropsPasser<RenewMockProps>

export type RenewMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockRenewComponent(passer: Passer): RenewComponent {
    return new Component(passer)
}

class Component extends MockComponent<RenewComponentState> implements RenewComponent {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: RenewMockProps): RenewComponentState {
            switch (props.type) {
                case "delayed":
                    return { type: "delayed-to-renew" }

                case "bad-request":
                    return { type: "failed-to-renew", err: { type: "bad-request" } }

                case "server-error":
                    return { type: "failed-to-renew", err: { type: "server-error" } }

                case "bad-response":
                    return { type: "failed-to-renew", err: { type: "bad-response", err: props.err } }

                case "infra-error":
                    return { type: "failed-to-renew", err: { type: "infra-error", err: props.err } }
            }
        }
    }

    request(): void {
        // mock では特に何もしない
    }
    succeedToInstantLoad(): void {
        // mock では特に何もしない
    }
    failedToInstantLoad(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}
