import { initHomeHref } from "../home/impl/href"

import { AppHref } from "../href"

export function newAppHref(): AppHref {
    return {
        home: initHomeHref(),
    }
}
