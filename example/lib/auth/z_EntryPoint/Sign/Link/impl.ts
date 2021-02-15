import { initSignLinkHrefComponent } from "./Href/impl"

import { SignLinkResource } from "./resource"

export function initSignLinkResource(): SignLinkResource {
    return {
        href: initSignLinkHrefComponent(),
    }
}
