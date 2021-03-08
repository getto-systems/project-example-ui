import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { LoadSeason } from "../../../common/season/action"

import { Season, SeasonError } from "../../../common/season/data"

export interface ExampleComponentFactory {
    (material: ExampleMaterial): ExampleComponent
}
export type ExampleMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export type ExampleComponent = ApplicationStateAction<ExampleComponentState>

export type ExampleComponentState =
    | Readonly<{ type: "initial-example" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialExampleComponentState: ExampleComponentState = { type: "initial-example" }
