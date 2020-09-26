import { newAuthLink } from "./auth/href"

import { TopLink } from "../href"

export function newTopLink(): TopLink {
    return {
        auth: newAuthLink(),
    }
}
