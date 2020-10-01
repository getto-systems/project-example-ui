import {
    ExampleComponent,
    ExampleComponentResource,
    ExampleState,
} from "../../../home/component/example/component"

export function newExampleComponent(): ExampleComponent {
    return new Component(new Init().initialExample())
}

class Init {
    initialExample(): ExampleState {
        return { type: "initial-example" }
    }
    error(): ExampleState {
        return { type: "error", err: "SYSTEM ERROR" }
    }
}

class Component implements ExampleComponent {
    state: ExampleState

    constructor(state: ExampleState) {
        this.state = state
    }

    onStateChange(stateChanged: Post<ExampleState>): void {
        stateChanged(this.state)
    }

    init(): ExampleComponentResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
