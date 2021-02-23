import { ApplicationStateAction } from "../../../../z_getto/application/action"

import { FindCurrentVersion } from "../../../version/local/action"

import { VersionString } from "../../../version/common/data"

export interface CurrentVersionComponentFactory {
    (material: CurrentVersionMaterial): CurrentVersionComponent
}
export type CurrentVersionMaterial = Readonly<{
    findCurrentVersion: FindCurrentVersion
}>

export type CurrentVersionComponent = ApplicationStateAction<CurrentVersionComponentState>

export type CurrentVersionComponentState =
    | Readonly<{ type: "initial-current-version" }>
    | Readonly<{ type: "succeed-to-find"; version: VersionString }>

export const initialCurrentVersionComponentState: CurrentVersionComponentState = {
    type: "initial-current-version",
}
