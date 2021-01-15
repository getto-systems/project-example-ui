import { MockComponent } from "../../../z_external/mock/component"

import { CurrentVersionComponent, CurrentVersionState } from "./component"

import { markVersion } from "../../shared/currentVersion/data"

export function initCurrentVersionComponent(state: CurrentVersionState): CurrentVersionMockComponent {
    return new CurrentVersionMockComponent(state)
}

export type CurrentVersionMockProps = Readonly<{ type: "success" }>

export function mapCurrentVersionMockProps(props: CurrentVersionMockProps): CurrentVersionState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-find", version: markVersion("1.0.0") }
    }
}

class CurrentVersionMockComponent
    extends MockComponent<CurrentVersionState>
    implements CurrentVersionComponent {
    load() {
        // mock では特に何もしない
    }
}
