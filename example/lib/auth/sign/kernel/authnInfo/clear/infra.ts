import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { AuthnInfoRepository } from "../common/infra"

export type ClearAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
}>
