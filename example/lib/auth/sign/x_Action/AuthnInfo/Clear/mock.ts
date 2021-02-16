import {
    MockAction,
    MockPropsPasser,
} from "../../../../../common/vendor/getto-example/Application/mock"

import { ClearAuthnInfoAction, ClearAuthnInfoActionState } from "./action"

export type ClearAuthnInfoMockPropsPasser = MockPropsPasser<ClearAuthnInfoMockProps>
export type ClearAuthnInfoMockProps =
    | Readonly<{ type: "initial-clear-authnInfo" }>
    | Readonly<{ type: "failed-clear-authnInfo"; err: string }>

export function initMockClearAuthnInfoAction(
    passer: ClearAuthnInfoMockPropsPasser
): ClearAuthnInfoAction {
    return new Action(passer)
}

class Action
    extends MockAction<ClearAuthnInfoActionState>
    implements ClearAuthnInfoAction {
    constructor(passer: ClearAuthnInfoMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ClearAuthnInfoMockProps): ClearAuthnInfoActionState {
            switch (props.type) {
                case "initial-clear-authnInfo":
                    return { type: "initial-logout" }

                case "failed-clear-authnInfo":
                    return {
                        type: "failed-to-logout",
                        err: { type: "infra-error", err: props.err },
                    }
            }
        }
    }

    submit() {
        // mock では特に何もしない
    }
}
