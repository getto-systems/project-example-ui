import { AuthzRepositoryPod } from "../../../auth/sign/auth_ticket/kernel/infra"
import { GetMenuBadgeRemotePod, MenuBadgeStore, MenuExpandStore, MenuTree } from "../kernel/infra"

export type UpdateMenuBadgeInfra = Readonly<{
    version: string
    menuTree: MenuTree
    authz: AuthzRepositoryPod
    getMenuBadge: GetMenuBadgeRemotePod
}>

export type UpdateMenuBadgeStore = Readonly<{
    menuExpand: MenuExpandStore
    menuBadge: MenuBadgeStore
}>
