import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"

import { NotifyUnexpectedErrorPod } from "./action"

import { NotifyUnexpectedErrorRemoteError } from "./data"

export type UnexpectedErrorInfra = UnexpectedNotifyInfra

export type UnexpectedNotifyInfra = Readonly<{
    notify: NotifyUnexpectedErrorRemotePod
}>

export interface NotifyUnexpectedError {
    (infra: UnexpectedNotifyInfra): NotifyUnexpectedErrorPod
}

type NotifyUnexpectedErrorRemoteTypes = RemoteTypes<
    unknown,
    true,
    true,
    NotifyUnexpectedErrorRemoteError
>
export type NotifyUnexpectedErrorRemotePod = NotifyUnexpectedErrorRemoteTypes["pod"]
export type NotifyUnexpectedErrorRemoteResult = NotifyUnexpectedErrorRemoteTypes["result"]
export type NotifyUnexpectedErrorSimulator = NotifyUnexpectedErrorRemoteTypes["simulator"]
