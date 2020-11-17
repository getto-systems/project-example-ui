import { LoadAction } from "../../../season/action"

import { Season } from "../../../season/data"

export interface SeasonComponentFactory {
    (actions: SeasonActionSet): SeasonComponent
}
export type SeasonActionSet = Readonly<{
    load: LoadAction
}>

export interface SeasonComponent {
    onStateChange(post: Post<SeasonState>): void
    action(request: SeasonRequest): void
}

export type SeasonState =
    | Readonly<{ type: "initial-season" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>

export const initialSeasonState: SeasonState = { type: "initial-season" }

export type SeasonRequest = Readonly<{ type: "load-season" }>

interface Post<T> {
    (state: T): void
}
