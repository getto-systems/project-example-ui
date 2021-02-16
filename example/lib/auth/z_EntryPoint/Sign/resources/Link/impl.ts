import { initAuthSignLinkHrefComponent } from "./Href/impl"

import { AuthSignLinkResource } from "./resource"

export function initAuthSignLinkResource(): AuthSignLinkResource {
    return {
        href: initAuthSignLinkHrefComponent(),
    }
}
