import { PagePathname } from "./data"

export function packPagePathname(url: URL): PagePathname {
    return url.pathname as PagePathname & string
}

export function unpackPagePathname(pagePathname: PagePathname): string {
    return pagePathname as unknown as string
}
