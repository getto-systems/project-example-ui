import { env } from "../../../y_environment/env"

import { newAuthzRepository } from "../../../auth/auth_ticket/kernel/infra/repository/authz"
import { newGetMenuBadgeRemote } from "../../kernel/infra/remote/get_menu_badge/core"
import { newGetMenuBadgeNoopRemote } from "../../kernel/infra/remote/get_menu_badge/noop"

import { UpdateMenuBadgeInfra } from "../infra"
import { MenuContent } from "../../kernel/infra"

export function newUpdateMenuBadgeInfra(
    webStorage: Storage,
    menuContent: MenuContent,
): UpdateMenuBadgeInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        authz: newAuthzRepository(webStorage),
        getMenuBadge: menuContent.loadMenuBadge
            ? newGetMenuBadgeRemote()
            : newGetMenuBadgeNoopRemote(),
    }
}
