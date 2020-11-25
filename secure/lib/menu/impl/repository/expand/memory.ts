import {
    MenuExpandRepository,
    MenuExpand,
    MenuExpandResponse,
    ToggleExpandResponse,
} from "../../../infra"

export function initMemoryMenuExpandRepository(expand: MenuExpand): MenuExpandRepository {
    return new MemoryMenuExpandRepository(expand)
}

class MemoryMenuExpandRepository implements MenuExpandRepository {
    expand: MenuExpand

    constructor(initialExpand: MenuExpand) {
        this.expand = initialExpand
    }

    findExpand(): MenuExpandResponse {
        return { success: true, expand: this.expand }
    }

    setExpand(category: string[]): ToggleExpandResponse {
        this.expand.register(category)
        return { success: true }
    }
    clearExpand(category: string[]): ToggleExpandResponse {
        this.expand.remove(category)
        return { success: true }
    }
}
