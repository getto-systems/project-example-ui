import { RepositoryConverter } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/detecter"
import { OutlineMenuCategoryLabel, OutlineMenuTarget } from "./data"
import { OutlineMenuExpand, OutlineMenuExpandRepositoryValue } from "./infra"

export function outlineMenuTargetLocationConverter(
    currentURL: URL,
    version: string,
): ConvertLocationResult<OutlineMenuTarget> {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return { valid: false }
    }
    return {
        valid: true,
        value: markOutlineMenuTarget(pathname.replace(versionPrefix, "/")),
    }
}

export const outlineMenuExpandRepositoryConverter: RepositoryConverter<
    OutlineMenuExpand,
    OutlineMenuExpandRepositoryValue
> = {
    toRepository: (value) => value,
    fromRepository: (value) => ({
        valid: true,
        // label の配列なので、validation error にする手がかりがない
        value: value.map((labels) => labels.map(markOutlineMenuCategoryLabel)),
    }),
}

function markOutlineMenuTarget(menuTarget: string): OutlineMenuTarget {
    return menuTarget as OutlineMenuTarget
}
function markOutlineMenuCategoryLabel(label: string): OutlineMenuCategoryLabel {
    return label as OutlineMenuCategoryLabel
}
