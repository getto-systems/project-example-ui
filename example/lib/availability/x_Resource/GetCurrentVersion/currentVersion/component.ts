import { ApplicationAction } from "../../../../common/vendor/getto-example/Application/action"

import { FindCurrentVersion } from "../../../version/local/action"

import { VersionString } from "../../../version/common/data"

export interface CurrentVersionComponentFactory {
    (material: CurrentVersionMaterial): CurrentVersionComponent
}
export type CurrentVersionMaterial = Readonly<{
    findCurrentVersion: FindCurrentVersion
}>

export interface CurrentVersionComponent extends ApplicationAction<CurrentVersionComponentState> {
    load(): void
}

export type CurrentVersionComponentState =
    | Readonly<{ type: "initial-current-version" }>
    | Readonly<{ type: "succeed-to-find"; version: VersionString }>

export const initialCurrentVersionComponentState: CurrentVersionComponentState = {
    type: "initial-current-version",
}
