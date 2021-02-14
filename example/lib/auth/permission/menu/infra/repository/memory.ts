import { initMemoryTypedStorage, MemoryTypedStorageStore } from "../../../../../z_infra/storage/memory"
import { initMenuExpandRepository } from "./menuExpand"

import { MenuExpand, MenuExpandRepository } from "../../infra"

export type MenuExpandMemoryStore = Readonly<{
    menuExpand: MemoryTypedStorageStore<MenuExpand>
}>
export function initMemoryMenuExpandRepository(storage: MenuExpandMemoryStore): MenuExpandRepository {
    return initMenuExpandRepository({
        menuExpand: initMemoryTypedStorage(storage.menuExpand),
    })
}
