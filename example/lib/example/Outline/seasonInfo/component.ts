import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { LoadSeason } from "../../shared/season/action"

import { Season, SeasonError } from "../../shared/season/data"

export interface SeasonInfoComponentFactory {
    (material: SeasonInfoMaterial): SeasonInfoComponent
}
export type SeasonInfoMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface SeasonInfoComponent extends ApplicationComponent<SeasonInfoState> {
    load(): void
}

export type SeasonInfoState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialSeasonInfoState: SeasonInfoState = { type: "initial-season" }
