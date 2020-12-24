import { MockComponent } from "../../../../z_external/mock/component"

import { SeasonComponent, SeasonState } from "./component"

import { markSeason } from "../../season/data"

export function initSeasonComponent(): SeasonComponent {
    return new SeasonMockComponent(new SeasonStateFactory().succeedToLoad())
}
export function initSeason(state: SeasonState): SeasonMockComponent {
    return new SeasonMockComponent(state)
}

export type SeasonMockProps =
    | Readonly<{ type: "failed"; err: string }>
    | Readonly<{ type: "success"; year: string }>

export function mapSeasonMockProps(props: SeasonMockProps): SeasonState {
    switch (props.type) {
        case "failed":
            return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }

        case "success":
            return { type: "succeed-to-load", season: markSeason({ year: parseInt(props.year) }) }
    }
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

class SeasonMockComponent extends MockComponent<SeasonState> implements SeasonComponent {
    load() {
        // mock では特に何もしない
    }
}
