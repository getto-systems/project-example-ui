import { CheckAuthInfoCoreAction, CheckAuthInfoCoreState } from "./Core/action"

export type CheckAuthInfoEntryPoint = Readonly<{
    resource: CheckAuthInfoResource
    terminate: { (): void }
}>
export type CheckAuthInfoResource = Readonly<{
    core: CheckAuthInfoCoreAction
}>
export type CheckAuthInfoResourceState = Readonly<{
    state: CheckAuthInfoCoreState
}>
