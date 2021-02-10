import { MockComponent, MockPropsPasser } from "../../../sub/getto-example/application/mock"

import { CurrentVersionComponent, CurrentVersionComponentState } from "./component"

import { markVersion } from "../../permission/currentVersion/data"

export type CurrentVersionMockPasser = MockPropsPasser<CurrentVersionMockProps>

export type CurrentVersionMockProps = Readonly<{ type: "success" }>

export function initMockCurrentVersionComponent(
    passer: CurrentVersionMockPasser
): CurrentVersionComponent {
    return new CurrentVersionMockComponent(passer)
}

class CurrentVersionMockComponent
    extends MockComponent<CurrentVersionComponentState>
    implements CurrentVersionComponent {
    constructor(passer: CurrentVersionMockPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: CurrentVersionMockProps): CurrentVersionComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-find", version: markVersion("1.0.0") }
            }
        }
    }

    load() {
        // mock では特に何もしない
    }
}
