import { TypedStorage } from "../../../../../../z_infra/storage/infra"
import { StoreResult } from "../../../../../../common/storage/infra"
import { OutlineMenuExpand, OutlineMenuExpandRepository, OutlineMenuExpandResponse } from "../../../infra"

export type OutlineMenuExpandStorage = Readonly<{
    menuExpand: TypedStorage<OutlineMenuExpand>
}>
export function initOutlineMenuExpandRepository(storage: OutlineMenuExpandStorage): OutlineMenuExpandRepository {
    return new Repository(storage)
}

class Repository implements OutlineMenuExpandRepository {
    storage: OutlineMenuExpandStorage

    constructor(storage: OutlineMenuExpandStorage) {
        this.storage = storage
    }

    load(): OutlineMenuExpandResponse {
        try {
            const result = this.storage.menuExpand.get()
            if (!result.found) {
                return { success: true, menuExpand: DEFAULT_MENU_EXPAND }
            }
            if (result.decodeError) {
                // デコードできなければ削除
                this.storage.menuExpand.remove()
                return { success: true, menuExpand: DEFAULT_MENU_EXPAND }
            }
            return { success: true, menuExpand: result.value }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    store(menuExpand: OutlineMenuExpand): StoreResult {
        try {
            this.storage.menuExpand.set(menuExpand)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

const DEFAULT_MENU_EXPAND: OutlineMenuExpand = []
