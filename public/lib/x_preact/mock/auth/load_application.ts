import { LoadApplicationComponent } from "../../../auth/load_application/component"

import { LoadApplicationComponentState, LoadApplicationComponentOperation } from "../../../auth/load_application/data"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return new Component(new Init().failedToLoad_infra_error())
}

class Init {
    failedToLoad_not_found(): LoadApplicationComponentState {
        return { type: "failed-to-load", err: { type: "not-found" } }
    }
    failedToLoad_infra_error(): LoadApplicationComponentState {
        return { type: "failed-to-load", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements LoadApplicationComponent {
    state: LoadApplicationComponentState

    constructor(state: LoadApplicationComponentState) {
        this.state = state
    }

    hook(_stateChanged: Publisher<LoadApplicationComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
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
