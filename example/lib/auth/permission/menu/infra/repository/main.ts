import { env } from "../../../../../y_environment/env"

import { initWebTypedStorage } from "../../../../../z_infra/storage/webStorage"

import { initMenuExpandConverter } from "./converter"
import { initMenuExpandRepository } from "./menuExpand"

import { MenuExpandRepository } from "../../infra"

export function newMainMenuExpandRepository(webStorage: Storage): MenuExpandRepository {
    return initMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            webStorage,
            env.storageKey.menuExpand.main,
            initMenuExpandConverter()
        ),
    })
}

export function newDocumentMenuExpandRepository(webStorage: Storage): MenuExpandRepository {
    return initMenuExpandRepository({
        menuExpand: initWebTypedStorage(
            webStorage,
            env.storageKey.menuExpand.document,
            initMenuExpandConverter()
        ),
    })
}
