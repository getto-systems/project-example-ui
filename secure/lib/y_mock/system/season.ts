import { packSeason } from "../../season/adapter"

import { SeasonComponent, SeasonState } from "../../system/component/season/component"

export function newSeasonComponent(): SeasonComponent {
    return new Component(new SeasonStateFactory().succeedToLoad())
}

class SeasonStateFactory {
    initialSeason(): SeasonState {
        return { type: "initial-season" }
    }
    succeedToLoad(): SeasonState {
        return {
            type: "succeed-to-load",
            season: packSeason({
                year: new Date().getFullYear(),
            }),
        }
    }
}

class Component implements SeasonComponent {
    state: SeasonState

    constructor(state: SeasonState) {
        this.state = state
    }

    onStateChange(post: Post<SeasonState>): void {
        post(this.state)
    }

    action() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
