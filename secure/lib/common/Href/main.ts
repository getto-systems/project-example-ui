import { initHomeHref } from "../Home/impl/href"

import { AppHref } from "./data"

export function newAppHref(): AppHref {
    return {
        home: initHomeHref(),
    }
}
