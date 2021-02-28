import { AuthzRepository } from "../../../../../common/authz/infra"
import { AuthnInfoRepository } from "../kernel/infra"

export type ClearInfra = Readonly<{
    authz: AuthzRepository
    authnInfos: AuthnInfoRepository
}>
