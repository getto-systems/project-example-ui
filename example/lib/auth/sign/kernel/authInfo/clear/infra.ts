import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { LastAuthRepositoryPod } from "../kernel/infra"

export type ClearInfra = Readonly<{
    lastAuth: LastAuthRepositoryPod
    authz: AuthzRepositoryPod
}>
