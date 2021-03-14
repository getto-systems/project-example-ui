import { AuthzRepositoryPod } from "../kernel/infra"
import { AuthnRepositoryPod } from "../kernel/infra"

export type ClearAuthTicketInfra = Readonly<{
    authn: AuthnRepositoryPod
    authz: AuthzRepositoryPod
}>
