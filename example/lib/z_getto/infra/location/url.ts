export function currentURL(): URL {
    return new URL(location.toString())
}
