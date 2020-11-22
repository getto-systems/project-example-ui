import { packSeason } from "../../../season/adapter"

import { ExampleComponent, ExampleState } from "../../../home/component/example/component"

export function newExampleComponent(): ExampleComponent {
    return new Component(new ExampleStateFactory().succeedToLoad())
}

class ExampleStateFactory {
    initialExample(): ExampleState {
        return { type: "initial-example" }
    }
    succeedToLoad(): ExampleState {
        return { type: "succeed-to-load", season: packSeason({ year: new Date().getFullYear() }) }
    }
}

class Component implements ExampleComponent {
    state: ExampleState

    constructor(state: ExampleState) {
        this.state = state
    }

    onStateChange(post: Post<ExampleState>): void {
        post(this.state)
    }

    load() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
