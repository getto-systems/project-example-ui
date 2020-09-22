import { LoadApplicationComponent } from "../../../auth/load_application/component"

import { LoadApplicationState, LoadApplicationComponentOperation } from "../../../auth/load_application/data"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return new Component(new Init().failedToLoad_infra_error())
}

class Init {
    failedToLoad_not_found(): LoadApplicationState {
        return { type: "failed-to-load", err: { type: "not-found" } }
    }
    failedToLoad_infra_error(): LoadApplicationState {
        return { type: "failed-to-load", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements LoadApplicationComponent {
    state: LoadApplicationState

    constructor(state: LoadApplicationState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<LoadApplicationState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Publisher<LoadApplicationState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    trigger(_operation: LoadApplicationComponentOperation): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Publisher<T> {
    (state: T): void
}
