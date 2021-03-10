import { menuExpandRepositoryConverter } from "../../kernel/impl/convert"
import { authzRepositoryConverter } from "../../../../common/authz/converter"

import { buildMenu } from "../../kernel/impl/menu"

import { initMenuExpand, MenuBadge } from "../../kernel/infra"
import { ToggleMenuExpandInfra, ToggleMenuExpandStore } from "../infra"

import { ToggleMenuExpandPod } from "../method"

import { ToggleMenuExpandEvent } from "../event"

interface Toggle {
    (infra: ToggleMenuExpandInfra, store: ToggleMenuExpandStore): ToggleMenuExpandPod
}
export const toggleMenuExpand: Toggle = (infra, store) => (detecter) => (path, post) => {
    const authz = infra.authz(authzRepositoryConverter)
    const menuExpand = infra.menuExpand(menuExpandRepositoryConverter)

    const authzResult = authz.get()
    if (!authzResult.success) {
        post({ type: "repository-error", err: authzResult.err })
        return
    }
    if (!authzResult.found) {
        authz.remove()
        post({ type: "required-to-login" })
        return
    }

    const fetchMenuExpandResult = store.menuExpand.get()
    const expand = fetchMenuExpandResult.found ? fetchMenuExpandResult.value : initMenuExpand()

    // toggle expand
    if (expand.hasEntry(path)) {
        expand.remove(path)
    } else {
        expand.register(path)
    }

    const storeResult = menuExpand.set(expand)
    if (!storeResult.success) {
        post({ type: "repository-error", err: storeResult.err })
        return
    }

    store.menuExpand.set(expand)

    const fetchMenuBadgeResult = store.menuBadge.get()
    const badge = fetchMenuBadgeResult.found ? fetchMenuBadgeResult.value : EMPTY_BADGE

    post({
        type: "succeed-to-toggle",
        menu: buildMenu({
            version: infra.version,
            menuTree: infra.menuTree,
            menuTargetPath: detecter(),
            permittedRoles: authzResult.value.roles,
            menuExpand: expand,
            menuBadge: badge,
        }),
    })
}

export function toggleMenuExpandEventHasDone(_event: ToggleMenuExpandEvent): boolean {
    return true
}

const EMPTY_BADGE: MenuBadge = {}
