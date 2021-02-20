import { env } from "../../../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../../../z_getto/infra/storage/webStorage"

import { initOutlineMenuExpandConverter } from "./converter"
import { initOutlineMenuExpandRepository } from "./core"

import { OutlineMenuExpandRepository } from "../../../infra"

export function newMainOutlineMenuExpandRepository(webStorage: Storage): OutlineMenuExpandRepository {
    return initOutlineMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            webStorage,
            env.storageKey.menuExpand.main,
            initOutlineMenuExpandConverter()
        ),
    })
}

export function newDocumentOutlineMenuExpandRepository(webStorage: Storage): OutlineMenuExpandRepository {
    return initOutlineMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            webStorage,
            env.storageKey.menuExpand.document,
            initOutlineMenuExpandConverter()
        ),
    })
}
