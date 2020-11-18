import { LoadSeasonAction } from "../../../season/action"

import { Season } from "../../../season/data"

export interface ExampleComponentFactory {
    (actions: ExampleActionSet): ExampleComponent
}
export type ExampleActionSet = Readonly<{
    loadSeason: LoadSeasonAction
}>

export interface ExampleComponent {
    onStateChange(post: Post<ExampleState>): void
    action(request: ExampleRequest): void
}

export type ExampleState =
    | Readonly<{ type: "initial-example" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>

export const initialExampleState: ExampleState = { type: "initial-example" }

export type ExampleRequest = Readonly<{ type: "load" }>

interface Post<T> {
    (state: T): void
}
