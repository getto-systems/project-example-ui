import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { LastAuthRepositoryPod } from "../kernel/infra"

export type ClearAuthInfoInfra = Readonly<{
    lastAuth: LastAuthRepositoryPod
    authz: AuthzRepositoryPod
}>
