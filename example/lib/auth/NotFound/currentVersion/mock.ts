import { MockComponent } from "../../../sub/getto-example/application/mock"

import { CurrentVersionComponent, CurrentVersionComponentState } from "./component"

import { markVersion } from "../../permission/currentVersion/data"

export function initMockCurrentVersionComponent(
    state: CurrentVersionComponentState
): CurrentVersionMockComponent {
    return new CurrentVersionMockComponent(state)
}

export type CurrentVersionMockProps = Readonly<{ type: "success" }>

export function mapCurrentVersionMockProps(props: CurrentVersionMockProps): CurrentVersionComponentState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-find", version: markVersion("1.0.0") }
    }
}

class CurrentVersionMockComponent
    extends MockComponent<CurrentVersionComponentState>
    implements CurrentVersionComponent {
    load() {
        // mock では特に何もしない
    }
}
