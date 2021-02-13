import { ApiCredential } from "../../../common/auth/apiCredential/data"
import { Delayed } from "../../../z_infra/delayed/infra"
import { RemoteAccess, RemoteAccessResult, RemoteAccessSimulator } from "../../../z_infra/remote/infra"
import { DelayTime } from "../../../z_infra/time/infra"

import { AuthCredential } from "../authCredential/common/data"

import { LoginFields, LoginRemoteError } from "./data"

export type PasswordLoginActionConfig = Readonly<{
    login: LoginConfig
}>

export type LoginInfra = Readonly<{
    login: LoginRemoteAccess
    config: LoginConfig
    delayed: Delayed
}>

export type LoginConfig = Readonly<{
    delay: DelayTime
}>

export type LoginRemoteAccess = RemoteAccess<LoginFields, LoginRemoteResponse, LoginRemoteError>
export type LoginRemoteAccessResult = RemoteAccessResult<LoginRemoteResponse, LoginRemoteError>
export type LoginSimulator = RemoteAccessSimulator<LoginFields, LoginRemoteResponse, LoginRemoteError>
export type LoginRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>
