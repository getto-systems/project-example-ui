import { newDB_OutlineMenuExpand } from "../../../../../../z_external/db/auth/menuExpand"
import { wrapRepository } from "../../../../../../z_vendor/getto-application/infra/repository/helper"

import { OutlineMenuExpandRepositoryPod } from "../../infra"

export function newOutlineMenuExpandRepository(
    storage: Storage,
    key: string,
): OutlineMenuExpandRepositoryPod {
    return wrapRepository(newDB_OutlineMenuExpand(storage, key))
}
