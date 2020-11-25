import { LoadSeasonAction } from "../../../season/action"

import { Season, SeasonError } from "../../../season/data"

export interface SeasonComponentFactory {
    (actions: SeasonActionSet): SeasonComponent
}
export type SeasonActionSet = Readonly<{
    loadSeason: LoadSeasonAction
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
