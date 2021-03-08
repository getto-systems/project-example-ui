import { env } from "../../../../y_environment/env"

import { newAuthzRepository } from "../../../../common/authz/infra/repository/authz"
import { newGetMenuBadgeRemote } from "../../kernel/infra/remote/getMenuBadge/core"

import { UpdateMenuBadgeInfra } from "../infra"

export function newUpdateMenuBadgeInfra(webStorage: Storage): UpdateMenuBadgeInfra {
    return {
        version: env.version,
        getMenuBadge: newGetMenuBadgeRemote(),
        authz: newAuthzRepository(webStorage),
    }
}
