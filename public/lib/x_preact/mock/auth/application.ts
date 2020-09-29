import {
    ApplicationComponent,
    ApplicationComponentResource,
    ApplicationState,
} from "../../../auth/component/application/component"

export function newApplicationComponent(): ApplicationComponent {
    return new Component(new Init().failedToLoad_not_found())
}

class Init {
    failedToLoad_not_found(): ApplicationState {
        return { type: "failed-to-load", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements ApplicationComponent {
    state: ApplicationState

    constructor(state: ApplicationState) {
        this.state = state
    }

    onStateChange(stateChanged: Post<ApplicationState>): void {
        stateChanged(this.state)
    }

    init(): ApplicationComponentResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
