import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { AuthnInfoRepository } from "../kernel/infra"

export type ClearAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
