import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { LoadSeason } from "../../shared/season/action"

import { Season, SeasonError } from "../../shared/season/data"

export interface ExampleComponentFactory {
    (material: ExampleMaterial): ExampleComponent
}
export type ExampleMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface ExampleComponent extends ApplicationComponent<ExampleComponentState> {
    load(): void
}

export type ExampleComponentState =
    | Readonly<{ type: "initial-example" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialExampleComponentState: ExampleComponentState = { type: "initial-example" }
