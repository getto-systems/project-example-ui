import {
    RemoteAccess,
    RemoteAccessError,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../z_infra/remote/infra"

import { NotifyUnexpectedErrorPod } from "./action"

export type UnexpectedErrorInfra = UnexpectedNotifyInfra

export type UnexpectedNotifyInfra = Readonly<{
    notify: NotifyUnexpectedErrorRemoteAccess
}>

export interface NotifyUnexpectedError {
    (infra: UnexpectedNotifyInfra): NotifyUnexpectedErrorPod
}

export type NotifyUnexpectedErrorRemoteAccess = RemoteAccess<unknown, true, RemoteAccessError>
export type NotifyUnexpectedErrorRemoteAccessResult = RemoteAccessResult<true, RemoteAccessError>
export type NotifyUnexpectedErrorSimulator = RemoteAccessSimulator<unknown, true, RemoteAccessError>
