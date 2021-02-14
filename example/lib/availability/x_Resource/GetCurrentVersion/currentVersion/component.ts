import { ApplicationComponent } from "../../../../vendor/getto-example/Application/component"

import { FindCurrentVersion } from "../../../version/currentVersion/action"

import { Version } from "../../../version/currentVersion/data"

export interface CurrentVersionComponentFactory {
    (material: CurrentVersionMaterial): CurrentVersionComponent
}
export type CurrentVersionMaterial = Readonly<{
    findCurrentVersion: FindCurrentVersion
}>

export interface CurrentVersionComponent extends ApplicationComponent<CurrentVersionComponentState> {
    load(): void
}

export type CurrentVersionComponentState =
    | Readonly<{ type: "initial-current-version" }>
    | Readonly<{ type: "succeed-to-find"; version: Version }>

export const initialCurrentVersionComponentState: CurrentVersionComponentState = {
    type: "initial-current-version",
}
