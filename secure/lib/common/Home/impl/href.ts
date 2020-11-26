import { HomeHref } from "../href"

export function initHomeHref(): HomeHref {
    return {
        dashboardHref,
        documentsHref,
    }
}

function dashboardHref(): string {
    // TODO ちゃんとする
    return "/dist/index.html"
}
function documentsHref(): string {
    // TODO ちゃんとする
    return "/dist/docs/index.html"
}
