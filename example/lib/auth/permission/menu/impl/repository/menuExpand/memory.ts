import {
    MenuExpand,
    MenuExpandRepository,
    MenuExpandResponse,
    ToggleExpandResponse,
} from "../../../infra"

export function initMemoryMenuExpandRepository(menuExpand: MenuExpand): MenuExpandRepository {
    return new MemoryMenuExpandRepository(menuExpand)
}

class MemoryMenuExpandRepository implements MenuExpandRepository {
    menuExpand: MenuExpand

    constructor(initialExpand: MenuExpand) {
        this.menuExpand = initialExpand
    }

    findMenuExpand(): MenuExpandResponse {
        return { success: true, menuExpand: this.menuExpand }
    }

    saveMenuExpand(menuExpand: MenuExpand): ToggleExpandResponse {
        this.menuExpand = menuExpand
        return { success: true }
    }
}
