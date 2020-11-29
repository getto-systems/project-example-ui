import { SeasonComponent, SeasonState } from "./component"

import { markSeason } from "../../season/data"

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
            season: markSeason({
                year: new Date().getFullYear(),
            }),
        }
    }
    failedToLoad(): SeasonState {
        return {
            type: "failed-to-load",
            err: { type: "infra-error", err: "load error" },
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

    load() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
