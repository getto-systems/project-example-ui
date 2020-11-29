import { SeasonActionSet, SeasonComponent, SeasonState } from "./component"

import { LoadSeasonEvent } from "../../season/data"

export function initSeason(actions: SeasonActionSet): SeasonComponent {
    return new Component(actions)
}

class Component implements SeasonComponent {
    actions: SeasonActionSet

    listener: Post<SeasonState>[] = []

    constructor(actions: SeasonActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<SeasonState>): void {
        this.listener.push(post)
    }
    post(state: SeasonState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.actions.loadSeason((event) => {
            this.post(this.mapLoadSeasonEvent(event))
        })
    }

    mapLoadSeasonEvent(event: LoadSeasonEvent): SeasonState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
