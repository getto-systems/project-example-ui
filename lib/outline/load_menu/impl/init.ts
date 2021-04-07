import { env } from "../../../y_environment/env"

import { newAuthzRepository } from "../../../auth/auth_ticket/kernel/infra/repository/authz"
import { newMenuExpandRepositoryPod } from "../../kernel/infra/repository/menu_expand"

import { MenuContent } from "../../kernel/infra"
import { LoadMenuInfra } from "../infra"

export function newLoadMenuInfra(webDB: IDBFactory, menuContent: MenuContent): LoadMenuInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        authz: newAuthzRepository(webDB),
        menuExpand: newMenuExpandRepositoryPod(webDB, menuContent),
    }
}
