import {
    MockAction,
    MockPropsPasser,
} from "../../../../../common/vendor/getto-example/Application/mock"

import {
    ClearAuthCredentialAction,
    ClearAuthCredentialActionState,
} from "./action"

export type ClearAuthCredentialMockPropsPasser = MockPropsPasser<
    ClearAuthCredentialMockProps
>
export type ClearAuthCredentialMockProps =
    | Readonly<{ type: "initial-clear-authCredential" }>
    | Readonly<{ type: "failed-clear-authCredential"; err: string }>

export function initMockClearAuthCredentialAction(
    passer: ClearAuthCredentialMockPropsPasser
): ClearAuthCredentialAction {
    return new Action(passer)
}

class Action
    extends MockAction<ClearAuthCredentialActionState>
    implements ClearAuthCredentialAction {
    constructor(passer: ClearAuthCredentialMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(
            props: ClearAuthCredentialMockProps
        ): ClearAuthCredentialActionState {
            switch (props.type) {
                case "initial-clear-authCredential":
                    return { type: "initial-logout" }

                case "failed-clear-authCredential":
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
