import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { AuthnInfoRepository } from "../kernel/infra"

export type ClearInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
