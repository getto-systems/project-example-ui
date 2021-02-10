import { Delayed } from "../../../z_infra/delayed/infra"
import { RemoteAccess, RemoteAccessResult } from "../../../z_infra/remote/infra"
import { RemoteAccessSimulator } from "../../../z_infra/remote/simulate"
import { DelayTime } from "../../../z_infra/time/infra"

import { AuthCredential } from "../../common/credential/data"
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

export type LoginRemoteAccess = RemoteAccess<LoginFields, AuthCredential, LoginRemoteError>
export type LoginRemoteAccessResult = RemoteAccessResult<AuthCredential, LoginRemoteError>
export type LoginSimulator = RemoteAccessSimulator<LoginFields, AuthCredential, LoginRemoteError>
