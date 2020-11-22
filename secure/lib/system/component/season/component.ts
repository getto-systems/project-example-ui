import { LoadSeasonAction } from "../../../season/action"

import { Season } from "../../../season/data"

export interface SeasonComponentFactory {
    (actions: SeasonActionSet): SeasonComponent
}
export type SeasonActionSet = Readonly<{
    load: LoadSeasonAction
}>

export interface SeasonComponent {
    onStateChange(post: Post<SeasonState>): void
    load(): void
}

export type SeasonState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>

export const initialSeasonState: SeasonState = { type: "initial-season" }

interface Post<T> {
    (state: T): void
}
