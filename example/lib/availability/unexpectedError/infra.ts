import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"

import { NotifyUnexpectedErrorPod } from "./action"

import { NotifyUnexpectedErrorRemoteError } from "./data"

export type UnexpectedErrorInfra = UnexpectedNotifyInfra

export type UnexpectedNotifyInfra = Readonly<{
    notify: NotifyUnexpectedErrorRemote
}>

export interface NotifyUnexpectedError {
    (infra: UnexpectedNotifyInfra): NotifyUnexpectedErrorPod
}

type NotifyUnexpectedErrorRemoteTypes = RemoteTypes<unknown, true, NotifyUnexpectedErrorRemoteError>
export type NotifyUnexpectedErrorRemote = NotifyUnexpectedErrorRemoteTypes["remote"]
export type NotifyUnexpectedErrorRemoteResult = NotifyUnexpectedErrorRemoteTypes["result"]
export type NotifyUnexpectedErrorSimulator = NotifyUnexpectedErrorRemoteTypes["simulator"]
