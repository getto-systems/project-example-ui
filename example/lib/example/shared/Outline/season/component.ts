import { LoadSeason } from "../../season/action"

import { Season, SeasonError } from "../../season/data"

export interface SeasonComponentFactory {
    (material: SeasonMaterial): SeasonComponent
}
export type SeasonMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface SeasonComponent {
    onStateChange(post: Post<SeasonState>): void
    load(): void
}

export type SeasonState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialSeasonState: SeasonState = { type: "initial-season" }

interface Post<T> {
    (state: T): void
}
