import { TypedStorage } from "../../../../../z_infra/storage/infra"
import { MenuExpand, MenuExpandRepository, MenuExpandResponse, ToggleExpandResponse } from "../../infra"

export type MenuExpandStorage = Readonly<{
    menuExpand: TypedStorage<MenuExpand>
}>
export function initMenuExpandRepository(storage: MenuExpandStorage): MenuExpandRepository {
    return new Repository(storage)
}

class Repository implements MenuExpandRepository {
    storage: MenuExpandStorage

    constructor(storage: MenuExpandStorage) {
        this.storage = storage
    }

    findMenuExpand(): MenuExpandResponse {
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

    saveMenuExpand(menuExpand: MenuExpand): ToggleExpandResponse {
        try {
            this.storage.menuExpand.set(menuExpand)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

const DEFAULT_MENU_EXPAND: MenuExpand = []
