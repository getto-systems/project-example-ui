import { ExampleActionSet, ExampleComponent, ExampleState } from "./component"

import { LoadSeasonEvent } from "../../../season/data"

export function initSeason(actions: ExampleActionSet): ExampleComponent {
    return new Component(actions)
}

class Component implements ExampleComponent {
    actions: ExampleActionSet

    listener: Post<ExampleState>[] = []

    constructor(actions: ExampleActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<ExampleState>): void {
        this.listener.push(post)
    }
    post(state: ExampleState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.actions.loadSeason((event) => {
            this.post(this.mapLoadSeasonEvent(event))
        })
    }

    mapLoadSeasonEvent(event: LoadSeasonEvent): ExampleState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
