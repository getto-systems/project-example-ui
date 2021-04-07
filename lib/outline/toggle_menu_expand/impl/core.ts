import { menuExpandRepositoryConverter } from "../../kernel/impl/converter"
import { authzRepositoryConverter } from "../../../auth/auth_ticket/kernel/converter"

import { buildMenu } from "../../kernel/impl/menu"

import { initMenuExpand, MenuBadge, MenuExpand } from "../../kernel/infra"
import { ToggleMenuExpandInfra, ToggleMenuExpandStore } from "../infra"

import { ToggleMenuExpandPod } from "../method"

import { ToggleMenuExpandEvent } from "../event"
import { MenuCategoryPath } from "../../kernel/data"

interface Toggle {
    (infra: ToggleMenuExpandInfra, store: ToggleMenuExpandStore): ToggleMenuExpandPod
}

export const showMenuExpand: Toggle = modifyMenuExpand((expand, path) => expand.register(path))
export const hideMenuExpand: Toggle = modifyMenuExpand((expand, path) => expand.remove(path))

interface ModifyExpand {
    (expand: MenuExpand, path: MenuCategoryPath): void
}
function modifyMenuExpand(modify: ModifyExpand): Toggle {
    return (infra, store) => (detecter) => async (path, post) => {
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

        modify(expand, path)

        // 別なタブで expand を変更した場合は上書き合戦になるが、マージは大変なのでさぼる
        // 対応が必要になったらストレージに update を追加してトランザクション内でマージする必要がある
        const storeResult = await menuExpand.set(expand)
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
                grantedRoles: authzResult.value.roles,
                menuExpand: expand,
                menuBadge: badge,
            }),
        })
    }
}

export function toggleMenuExpandEventHasDone(_event: ToggleMenuExpandEvent): boolean {
    return true
}

const EMPTY_BADGE: MenuBadge = new Map()
