import { ApplicationEntryPoint } from "../../../../../z_vendor/getto-application/action/action"

import { CheckAuthInfoCoreAction, CheckAuthInfoCoreState } from "./core/action"

export type CheckAuthInfoEntryPoint = ApplicationEntryPoint<CheckAuthInfoResource>

export type CheckAuthInfoResource = Readonly<{
    core: CheckAuthInfoCoreAction
}>
export type CheckAuthInfoResourceState = Readonly<{
    state: CheckAuthInfoCoreState
}>
