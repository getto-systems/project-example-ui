import {
    MockAction,
    MockPropsPasser,
} from "../../../../../../../z_getto/application/mock"

import { RenewAuthnInfoAction, RenewAuthnInfoState } from "./action"

export type RenewAuthnInfoMockPropsPasser = MockPropsPasser<RenewAuthnInfoMockProps>
export type RenewAuthnInfoMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockRenewAuthnInfoAction(
    passer: RenewAuthnInfoMockPropsPasser
): RenewAuthnInfoAction {
    return new Action(passer)
}

class Action extends MockAction<RenewAuthnInfoState> implements RenewAuthnInfoAction {
    constructor(passer: RenewAuthnInfoMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: RenewAuthnInfoMockProps): RenewAuthnInfoState {
            switch (props.type) {
                case "delayed":
                    return { type: "delayed-to-renew" }

                case "bad-request":
                    return { type: "failed-to-renew", err: { type: "bad-request" } }

                case "server-error":
                    return { type: "failed-to-renew", err: { type: "server-error" } }

                case "bad-response":
                    return {
                        type: "failed-to-renew",
                        err: { type: "bad-response", err: props.err },
                    }

                case "infra-error":
                    return {
                        type: "failed-to-renew",
                        err: { type: "infra-error", err: props.err },
                    }
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
