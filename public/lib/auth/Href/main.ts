import { initAuthHref } from "../Auth/View/impl/href"

import { AppHref } from "./data"

export function newAppHref(): AppHref {
    return {
        auth: initAuthHref(),
    }
}
