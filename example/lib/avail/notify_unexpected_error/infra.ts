import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"

import { AuthzRepositoryPod } from "../../auth/auth_ticket/kernel/infra"

import { NotifyUnexpectedErrorRemoteError } from "./data"

export type NotifyUnexpectedErrorInfra = Readonly<{
    authz: AuthzRepositoryPod
    notify: NotifyUnexpectedErrorRemotePod
}>

type NotifyUnexpectedErrorRemoteTypes = RemoteTypes<
    unknown,
    true,
    true,
    NotifyUnexpectedErrorRemoteError
>
export type NotifyUnexpectedErrorRemotePod = NotifyUnexpectedErrorRemoteTypes["pod"]
export type NotifyUnexpectedErrorRemoteResult = NotifyUnexpectedErrorRemoteTypes["result"]
export type NotifyUnexpectedErrorSimulator = NotifyUnexpectedErrorRemoteTypes["simulator"]
