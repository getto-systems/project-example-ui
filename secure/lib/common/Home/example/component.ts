import { LoadSeasonAction } from "../../season/action"

import { Season, SeasonError } from "../../season/data"

export interface ExampleComponentFactory {
    (actions: ExampleActionSet): ExampleComponent
}
export type ExampleActionSet = Readonly<{
    loadSeason: LoadSeasonAction
}>

export interface ExampleComponent {
    onStateChange(post: Post<ExampleState>): void
    load(): void
}

export type ExampleState =
    | Readonly<{ type: "initial-example" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialExampleState: ExampleState = { type: "initial-example" }

interface Post<T> {
    (state: T): void
}
