import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"

import { AuthzRepositoryPod } from "../../auth/sign/auth_ticket/kernel/infra"

import { AuthzNonce } from "../../auth/sign/auth_ticket/kernel/data"
import { NotifyUnexpectedErrorRemoteError } from "./data"

export type NotifyUnexpectedErrorInfra = Readonly<{
    authz: AuthzRepositoryPod
    notify: NotifyUnexpectedErrorRemotePod
}>

type NotifyUnexpectedErrorRemoteTypes = RemoteTypes<
    NotifyUnexpectedErrorMessage,
    true,
    true,
    NotifyUnexpectedErrorRemoteError
>
export type NotifyUnexpectedErrorRemotePod = NotifyUnexpectedErrorRemoteTypes["pod"]
export type NotifyUnexpectedErrorRemoteResult = NotifyUnexpectedErrorRemoteTypes["result"]
export type NotifyUnexpectedErrorSimulator = NotifyUnexpectedErrorRemoteTypes["simulator"]
export type NotifyUnexpectedErrorMessage = Readonly<{
    nonce: AuthzNonce
    err: unknown
}>
