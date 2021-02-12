import { initLinkComponent } from "./Link/impl"

import { LoginLinkResource } from "./resource"

export function initLoginLinkResource(): LoginLinkResource {
    return {
        link: initLinkComponent(),
    }
}
