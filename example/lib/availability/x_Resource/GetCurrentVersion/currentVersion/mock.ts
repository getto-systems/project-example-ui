import { MockAction, MockPropsPasser } from "../../../../z_getto/action/mock"

import { CurrentVersionComponent, CurrentVersionComponentState } from "./component"

import { markVersionString } from "../../../version/common/data"

export type CurrentVersionMockPropsPasser = MockPropsPasser<CurrentVersionMockProps>

export type CurrentVersionMockProps = Readonly<{ type: "success" }>

export function initMockCurrentVersionComponent(
    passer: CurrentVersionMockPropsPasser,
): CurrentVersionComponent {
    return new CurrentVersionMockComponent(passer)
}

class CurrentVersionMockComponent
    extends MockAction<CurrentVersionComponentState>
    implements CurrentVersionComponent {
    readonly initialState: CurrentVersionComponentState = { type: "initial-current-version" }

    constructor(passer: CurrentVersionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: CurrentVersionMockProps): CurrentVersionComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-find", version: markVersionString("1.0.0") }
            }
        }
    }

    load() {
        // mock では特に何もしない
    }
}
