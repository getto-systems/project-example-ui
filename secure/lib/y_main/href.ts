import { initHomeHref } from "../home/impl/href"

import { AppHref } from "../href/data"

export function newAppHref(): AppHref {
    return {
        home: initHomeHref(),
    }
}
