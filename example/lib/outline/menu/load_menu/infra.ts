import { AuthzRepositoryPod } from "../../../common/authz/infra"
import { MenuExpandRepositoryPod, MenuTree } from "../kernel/infra"

export type LoadMenuInfra = Readonly<{
    version: string
    menuTree: MenuTree
    authz: AuthzRepositoryPod
    menuExpand: MenuExpandRepositoryPod
}>
