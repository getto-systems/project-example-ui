import { LoadSeason } from "../../shared/season/action"

import { Season, SeasonError } from "../../shared/season/data"

export interface ExampleComponentFactory {
    (material: ExampleMaterial): ExampleComponent
}
export type ExampleMaterial = Readonly<{
    loadSeason: LoadSeason
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