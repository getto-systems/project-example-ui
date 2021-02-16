import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthCredentialRepository } from "../common/infra"

import { SubmitClearAuthCredentialMethod } from "./action"

export type ClearActionInfra = SubmitClearAuthCredentialInfra

export type SubmitClearAuthCredentialInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>
export interface SubmitClearAuthCredential {
    (infra: SubmitClearAuthCredentialInfra): SubmitClearAuthCredentialMethod
}
