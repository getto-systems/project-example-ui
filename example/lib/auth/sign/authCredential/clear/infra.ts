import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthCredentialRepository } from "../common/infra"

export type ClearAuthCredentialInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>
