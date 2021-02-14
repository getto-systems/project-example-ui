import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthCredentialRepository } from "../common/infra"

import { LogoutPod } from "./action"

export type ClearActionInfra = LogoutInfra

export type LogoutInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>
export interface Logout {
    (infra: LogoutInfra): LogoutPod
}
