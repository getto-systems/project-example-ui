import { ExampleComponent, ExampleState } from "./component"

import { markSeason } from "../../../common/season/data"

export function initExample(): ExampleComponent {
    return new Component(new ExampleStateFactory().succeedToLoad())
}

class ExampleStateFactory {
    initialExample(): ExampleState {
        return { type: "initial-example" }
    }
    succeedToLoad(): ExampleState {
        return { type: "succeed-to-load", season: markSeason({ year: new Date().getFullYear() }) }
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
