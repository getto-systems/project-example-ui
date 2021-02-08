import { MockComponent } from "../../../sub/getto-example/application/mock"

import { SeasonInfoComponent, SeasonInfoState } from "./component"

import { markSeason } from "../../shared/season/data"

export function initMockSeasonInfoComponent(state: SeasonInfoState): SeasonInfoMockComponent {
    return new SeasonInfoMockComponent(state)
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

class SeasonInfoMockComponent extends MockComponent<SeasonInfoState> implements SeasonInfoComponent {
    load() {
        // mock では特に何もしない
    }
}
