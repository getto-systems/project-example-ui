import {
    MenuExpandRepository,
    MenuExpandResponse,
    ToggleExpandResponse,
} from "../../../infra"

export function initMemoryMenuExpandRepository(menuExpand: string[][]): MenuExpandRepository {
    return new MemoryMenuExpandRepository(menuExpand)
}

class MemoryMenuExpandRepository implements MenuExpandRepository {
    menuExpand: string[][]

    constructor(initialExpand: string[][]) {
        this.menuExpand = initialExpand
    }

    findMenuExpand(): MenuExpandResponse {
        return { success: true, menuExpand: this.menuExpand }
    }

    saveMenuExpand(menuExpand: string[][]): ToggleExpandResponse {
        this.menuExpand = menuExpand
        return { success: true }
    }
}
