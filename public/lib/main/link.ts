import { newAuthLink } from "./auth/link"

import { TopLink } from "../link"

export function newTopLink(): TopLink {
    return {
        auth: newAuthLink(),
    }
}
