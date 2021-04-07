import { authzRepositoryConverter } from "../../../auth/auth_ticket/kernel/converter"
import { menuBadgeRemoteConverter } from "../../kernel/impl/converter"

import { buildMenu, BuildMenuParams } from "../../kernel/impl/menu"

import { initMenuExpand, MenuBadge } from "../../kernel/infra"
import { UpdateMenuBadgeInfra, UpdateMenuBadgeStore } from "../infra"

import { UpdateMenuBadgePod } from "../method"

import { UpdateMenuBadgeEvent } from "../event"

interface Update {
    (infra: UpdateMenuBadgeInfra, store: UpdateMenuBadgeStore): UpdateMenuBadgePod
}
export const updateMenuBadge: Update = (infra, store) => (detecter) => async (post) => {
    const getMenuBadge = infra.getMenuBadge(menuBadgeRemoteConverter)
    const authz = infra.authz(authzRepositoryConverter)

    const authzResult = await authz.get()
    if (!authzResult.success) {
        post({ type: "repository-error", err: authzResult.err })
        return
    }
    if (!authzResult.found) {
        authz.remove()
        post({ type: "required-to-login" })
        return
    }

    const fetchResult = store.menuExpand.get()
    const expand = fetchResult.found ? fetchResult.value : initMenuExpand()

    const buildParams: BuildMenuParams = {
        version: infra.version,
        grantedRoles: authzResult.value.roles,
        menuExpand: expand,
        menuTargetPath: detecter(),
        menuTree: infra.menuTree,
        menuBadge: EMPTY_BADGE,
    }

    const response = await getMenuBadge({ type: "always" })
    if (!response.success) {
        post({ type: "failed-to-update", menu: buildMenu(buildParams), err: response.err })
        return
    }

    store.menuBadge.set(response.value)

    post({
        type: "succeed-to-update",
        menu: buildMenu({ ...buildParams, menuBadge: response.value }),
    })
}

export function updateMenuBadgeEventHasDone(_event: UpdateMenuBadgeEvent): boolean {
    return true
}

const EMPTY_BADGE: MenuBadge = new Map()
