import { MockAction, MockPropsPasser } from "../../../../../common/vendor/getto-example/Application/mock"

import { RenewAuthCredentialComponent, RenewAuthCredentialComponentState } from "./component"

type Passer = MockPropsPasser<RenewMockProps>

export type RenewMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockRenewAuthCredentialComponent(passer: Passer): RenewAuthCredentialComponent {
    return new Component(passer)
}

class Component
    extends MockAction<RenewAuthCredentialComponentState>
    implements RenewAuthCredentialComponent {
    constructor(passer: Passer) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: RenewMockProps): RenewAuthCredentialComponentState {
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
