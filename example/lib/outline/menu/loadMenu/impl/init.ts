import { env } from "../../../../y_environment/env"

import { newAuthzRepository } from "../../../../common/authz/infra/repository/authz"
import { newMenuExpandRepository } from "../../kernel/infra/repository/menuExpand"

import { MenuContent } from "../../kernel/infra"
import { LoadMenuInfra } from "../infra"

export function newLoadMenuInfra(webStorage: Storage, menuContent: MenuContent): LoadMenuInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        authz: newAuthzRepository(webStorage),
        menuExpand: newMenuExpandRepository(webStorage, menuContent.key),
    }
}
