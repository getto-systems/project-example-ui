import { MenuExpandClient, MenuExpandResponse } from "../../../infra"

export function initMemoryMenuExpandClient(expand: MenuExpandResponse): MenuExpandClient {
    return new MemoryMenuExpandClient(expand)
}

class MemoryMenuExpandClient implements MenuExpandClient {
    expand: MenuExpandResponse

    constructor(expand: MenuExpandResponse) {
        this.expand = expand
    }

    getExpand(): MenuExpandResponse {
        return this.expand
    }
}
