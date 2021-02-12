import {
    MockComponent,
    MockPropsPasser,
} from "../../../../sub/getto-example/x_components/Application/mock"

import { LogoutComponent, LogoutComponentState } from "./component"

export type LogoutMockPropsPasser = MockPropsPasser<LogoutMockProps>

export type LogoutMockProps = Readonly<{ type: "failed"; err: string }>

export function initMockLogoutComponent(passer: LogoutMockPropsPasser): Component {
    return new Component(passer)
}

class Component extends MockComponent<LogoutComponentState> implements LogoutComponent {
    constructor(passer: LogoutMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: LogoutMockProps): LogoutComponentState {
            switch (props.type) {
                case "failed":
                    return { type: "failed-to-logout", err: { type: "infra-error", err: props.err } }
            }
        }
    }

    submit() {
        // mock では特に何もしない
    }
}
