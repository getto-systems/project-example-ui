import { env } from "../../../../y_environment/env"

import { newAuthzRepository } from "../../../../common/authz/infra/repository/authz"
import { newGetMenuBadgeRemote } from "../../kernel/infra/remote/getMenuBadge/core"

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
        getMenuBadge: newGetMenuBadgeRemote(),
    }
}
