import { MockAction, MockPropsPasser } from "../../../../../../../z_getto/application/mock"

import { LogoutAction, LogoutState } from "./action"

export type LogoutMockPropsPasser = MockPropsPasser<LogoutMockProps>
export type LogoutMockProps =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "failed-logout"; err: string }>

export function initMockLogoutAction(passer: LogoutMockPropsPasser): LogoutAction {
    return new Action(passer)
}

class Action extends MockAction<LogoutState> implements LogoutAction {
    constructor(passer: LogoutMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => this.post(mapProps(props)))

        function mapProps(props: LogoutMockProps): LogoutState {
            switch (props.type) {
                case "initial-logout":
                    return { type: "initial-logout" }

                case "failed-logout":
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
