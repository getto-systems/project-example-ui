import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { LoadSeason } from "../../../shared/season/action"

import { Season, SeasonError } from "../../../shared/season/data"

export interface SeasonInfoComponentFactory {
    (material: SeasonInfoMaterial): SeasonInfoComponent
}
export type SeasonInfoMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export type SeasonInfoComponent = ApplicationStateAction<SeasonInfoComponentState>

export type SeasonInfoComponentState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialSeasonInfoComponentState: SeasonInfoComponentState = { type: "initial-season" }
