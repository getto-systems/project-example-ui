import { markPagePathname, PagePathname } from "../data"

export function detectPagePathname(currentURL: URL): PagePathname {
    return markPagePathname(currentURL.pathname)
}
