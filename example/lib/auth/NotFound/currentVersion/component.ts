import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { FindCurrentVersion } from "../../permission/currentVersion/action"

import { Version } from "../../permission/currentVersion/data"

export interface CurrentVersionComponentFactory {
    (material: CurrentVersionMaterial): CurrentVersionComponent
}
export type CurrentVersionMaterial = Readonly<{
    findCurrentVersion: FindCurrentVersion
}>

export interface CurrentVersionComponent extends ApplicationComponent<CurrentVersionState> {
    load(): void
}

export type CurrentVersionState =
    | Readonly<{ type: "initial-current-version" }>
    | Readonly<{ type: "succeed-to-find"; version: Version }>

export const initialCurrentVersionState: CurrentVersionState = { type: "initial-current-version" }
