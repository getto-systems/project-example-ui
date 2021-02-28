import {
    initMemoryTypedStorage,
    MemoryTypedStorageStore,
} from "../../../../../../../z_vendor/getto-application/infra/storage/typed/memory"
import { initOutlineMenuExpandRepository } from "./core"

import { OutlineMenuExpand, OutlineMenuExpandRepository } from "../../../infra"

export type OutlineMenuExpandMemoryStore = Readonly<{
    menuExpand: MemoryTypedStorageStore<OutlineMenuExpand>
}>
export function initMemoryOutlineMenuExpandRepository(
    storage: OutlineMenuExpandMemoryStore
): OutlineMenuExpandRepository {
    return initOutlineMenuExpandRepository({
        menuExpand: initMemoryTypedStorage(storage.menuExpand),
    })
}
