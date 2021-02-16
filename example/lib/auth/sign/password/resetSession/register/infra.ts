import { ApiCredential } from "../../../../../common/apiCredential/data"
import { Delayed } from "../../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../../z_infra/time/infra"
import { AuthnInfo } from "../../../authnInfo/common/data"

import {
    PasswordResetFields,
    PasswordResetToken,
    RegisterPasswordResetSessionRemoteError,
} from "./data"

export type RegisterPasswordResetSessionInfra = Readonly<{
    register: RegisterPasswordResetSessionRemoteAccess
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type RegisterPasswordResetSessionRemoteAccess = RemoteAccess<
    RegisterPasswordResetSessionRemoteMessage,
    RegisterPasswordResetSessionRemoteResponse,
    RegisterPasswordResetSessionRemoteError
>
export type RegisterPasswordResetSessionRemoteAccessResult = RemoteAccessResult<
    RegisterPasswordResetSessionRemoteResponse,
    RegisterPasswordResetSessionRemoteError
>
export type RegisterPasswordResetSessionSimulator = RemoteAccessSimulator<
    RegisterPasswordResetSessionRemoteMessage,
    RegisterPasswordResetSessionRemoteResponse,
    RegisterPasswordResetSessionRemoteError
>
export type RegisterPasswordResetSessionRemoteResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>

export type RegisterPasswordResetSessionRemoteMessage = Readonly<{
    resetToken: PasswordResetToken
    fields: PasswordResetFields
}>
