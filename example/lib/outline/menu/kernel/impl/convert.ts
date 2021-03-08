import { RepositoryConverter } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/detecter"
import { MenuCategoryLabel, MenuTargetPath } from "../data"
import { MenuBadge, MenuBadgeItem, MenuExpand, MenuExpandRepositoryValue } from "../infra"

export function menuTargetPathLocationConverter(
    currentURL: URL,
    version: string,
): ConvertLocationResult<MenuTargetPath> {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return { valid: false }
    }
    return {
        valid: true,
        value: markMenuTargetPath(pathname.replace(versionPrefix, "/")),
    }
}

export function menuBadgeRemoteConverter(menuBadgeItems: MenuBadgeItem[]): MenuBadge {
    return menuBadgeItems.reduce((acc, item) => {
        acc[item.path] = item.count
        return acc
    }, <MenuBadge>{})
}

export const menuExpandRepositoryConverter: RepositoryConverter<
    MenuExpand,
    MenuExpandRepositoryValue
> = {
    toRepository: (value) => value,
    fromRepository: (value) => ({
        valid: true,
        // label の配列なので、validation error にする手がかりがない
        value: value.map((labels) => labels.map(markMenuCategoryLabel)),
    }),
}

function markMenuTargetPath(target: string): MenuTargetPath {
    return target as MenuTargetPath
}
function markMenuCategoryLabel(label: string): MenuCategoryLabel {
    return label as MenuCategoryLabel
}
