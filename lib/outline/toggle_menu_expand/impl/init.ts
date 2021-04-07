import { env } from "../../../y_environment/env"

import { newAuthzRepository } from "../../../auth/auth_ticket/kernel/infra/repository/authz"
import { newMenuExpandRepository } from "../../kernel/infra/repository/menu_expand"

import { MenuContent } from "../../kernel/infra"
import { ToggleMenuExpandInfra } from "../infra"

export function newToggleMenuExpandInfra(
    webStorage: Storage,
    webDB: IDBFactory,
    menuContent: MenuContent,
): ToggleMenuExpandInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        authz: newAuthzRepository(webStorage),
        menuExpand: newMenuExpandRepository(webDB, menuContent),
    }
}
