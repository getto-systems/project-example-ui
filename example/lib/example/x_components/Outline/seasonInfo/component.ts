import { ApplicationComponent } from "../../../../sub/getto-example/Application/component"

import { LoadSeason } from "../../../shared/season/action"

import { Season, SeasonError } from "../../../shared/season/data"

export interface SeasonInfoComponentFactory {
    (material: SeasonInfoMaterial): SeasonInfoComponent
}
export type SeasonInfoMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface SeasonInfoComponent extends ApplicationComponent<SeasonInfoComponentState> {
    load(): void
}

export type SeasonInfoComponentState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialSeasonInfoComponentState: SeasonInfoComponentState = { type: "initial-season" }
