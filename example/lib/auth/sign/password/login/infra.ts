import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { RemoteAccess, RemoteAccessResult, RemoteAccessSimulator } from "../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../z_infra/time/infra"

import { AuthCredential } from "../../authCredential/common/data"
import { SubmitPod } from "./action"

import { LoginFields, SubmitRemoteError } from "./data"

export type LoginActionInfra = SubmitInfra

export type SubmitInfra = Readonly<{
    login: LoginRemoteAccess
    config: SubmitConfig
    delayed: Delayed
}>
export type SubmitConfig = Readonly<{
    delay: DelayTime
}>

export interface Submit {
    (infra: SubmitInfra): SubmitPod
}

export type LoginRemoteAccess = RemoteAccess<LoginFields, LoginRemoteResponse, SubmitRemoteError>
export type LoginRemoteAccessResult = RemoteAccessResult<LoginRemoteResponse, SubmitRemoteError>
export type LoginSimulator = RemoteAccessSimulator<LoginFields, LoginRemoteResponse, SubmitRemoteError>
export type LoginRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>
