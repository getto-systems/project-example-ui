import { newAuthHref } from "./auth/href"

import { AppHref } from "../href"

export function newAppHref(): AppHref {
    return {
        auth: newAuthHref(),
    }
}
