import { initAuthHref } from "../auth/impl/href"

import { AppHref } from "../href/data"

export function newAppHref(): AppHref {
    return {
        auth: initAuthHref(),
    }
}
