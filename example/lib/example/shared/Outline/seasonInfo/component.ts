import { LoadSeason } from "../../season/action"

import { Season, SeasonError } from "../../season/data"

export interface SeasonInfoComponentFactory {
    (material: SeasonInfoMaterial): SeasonInfoComponent
}
export type SeasonInfoMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface SeasonInfoComponent {
    onStateChange(post: Post<SeasonInfoState>): void
    load(): void
}

export type SeasonInfoState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialSeasonInfoState: SeasonInfoState = { type: "initial-season" }

interface Post<T> {
    (state: T): void
}
