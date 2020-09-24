import { LoadApplicationComponent } from "../../../auth/load_application/component"

import { LoadApplicationState, LoadApplicationComponentOperation } from "../../../auth/load_application/data"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return new Component(new Init().failedToLoad_not_found())
}

class Init {
    failedToLoad_not_found(): LoadApplicationState {
        return { type: "failed-to-load", err: { type: "not-found" } }
    }
}

class Component implements LoadApplicationComponent {
    state: LoadApplicationState

    constructor(state: LoadApplicationState) {
        this.state = state
    }

    hook(_stateChanged: Dispatcher<LoadApplicationState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Dispatcher<LoadApplicationState>): void {
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

interface Dispatcher<T> {
    (state: T): void
}
