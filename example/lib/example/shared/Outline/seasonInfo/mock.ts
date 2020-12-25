import { MockComponent } from "../../../../z_external/mock/component"

import { SeasonInfoComponent, SeasonInfoState } from "./component"

import { markSeason } from "../../season/data"

export function initSeason(state: SeasonInfoState): SeasonMockComponent {
    return new SeasonMockComponent(state)
}

export type SeasonMockProps =
    | Readonly<{ type: "success"; year: number }>
    | Readonly<{ type: "failed"; err: string }>

export function mapSeasonMockProps(props: SeasonMockProps): SeasonInfoState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", season: markSeason({ year: props.year }) }

        case "failed":
            return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }
    }
}

class SeasonMockComponent extends MockComponent<SeasonInfoState> implements SeasonInfoComponent {
    load() {
        // mock では特に何もしない
    }
}
