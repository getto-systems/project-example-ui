import { AuthzRepositoryPod } from "../../../common/authz/infra"
import { GetMenuBadgeRemotePod } from "../kernel/infra"

export type UpdateMenuBadgeInfra = Readonly<{
    version: string
    getMenuBadge: GetMenuBadgeRemotePod
    authz: AuthzRepositoryPod
}>
