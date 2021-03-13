import { AuthzRepositoryPod } from "../../../auth/common/authz/infra"
import { MenuBadgeStore, MenuExpandRepositoryPod, MenuExpandStore, MenuTree } from "../kernel/infra"

export type ToggleMenuExpandInfra = Readonly<{
    version: string
    menuTree: MenuTree
    authz: AuthzRepositoryPod
    menuExpand: MenuExpandRepositoryPod
}>

export type ToggleMenuExpandStore = Readonly<{
    menuExpand: MenuExpandStore
    menuBadge: MenuBadgeStore
}>
