import { AuthzRepositoryPod } from "../kernel/infra"
import { AuthnRepositoryPod } from "../kernel/infra"

export type ClearAuthInfoInfra = Readonly<{
    authn: AuthnRepositoryPod
    authz: AuthzRepositoryPod
}>
