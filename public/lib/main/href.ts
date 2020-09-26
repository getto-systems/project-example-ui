import { initAuthHref } from "../auth/impl/href"

import { AppHref } from "../href"

export function newAppHref(): AppHref {
    return {
        auth: initAuthHref(),
    }
}
