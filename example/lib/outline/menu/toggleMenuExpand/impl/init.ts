import { newMenuExpandRepository } from "../../kernel/infra/repository/menuExpand"

import { MenuContent } from "../../kernel/infra"
import { ToggleMenuExpandInfra } from "../infra"

export function newToggleMenuExpandInfra(
    webStorage: Storage,
    menuContent: MenuContent,
): ToggleMenuExpandInfra {
    return {
        menuExpand: newMenuExpandRepository(webStorage, menuContent.key),
    }
}
