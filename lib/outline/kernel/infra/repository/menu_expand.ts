import { newDB_MenuExpand } from "../../../../z_external/db/outline/menu_expand"
import { convertRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"

import { MenuExpandRepositoryPod } from "../../infra"

export type MenuExpandRepositoryParams = Readonly<{
    database: string
    key: string
}>
export function newMenuExpandRepositoryPod(
    webDB: IDBFactory,
    params: MenuExpandRepositoryParams,
): MenuExpandRepositoryPod {
    return convertRepository(newDB_MenuExpand(webDB, params))
}
