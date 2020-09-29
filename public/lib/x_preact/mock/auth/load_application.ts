import {
    LoadApplicationComponent,
    LoadApplicationComponentResource,
    LoadApplicationState,
} from "../../../auth/component/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return new Component(new Init().failedToLoad_not_found())
}

class Init {
    failedToLoad_not_found(): LoadApplicationState {
        return { type: "failed-to-load", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements LoadApplicationComponent {
    state: LoadApplicationState

    constructor(state: LoadApplicationState) {
        this.state = state
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        stateChanged(this.state)
    }

    init(): LoadApplicationComponentResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
