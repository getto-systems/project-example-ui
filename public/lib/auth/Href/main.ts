import { initAuthHref } from "../Auth/impl/href"

import { AppHref } from "./data"

export function newAppHref(): AppHref {
    return {
        auth: initAuthHref(),
    }
}
