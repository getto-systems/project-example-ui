import { RepositoryConverter } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { OutlineMenuCategoryLabel } from "./data"
import { OutlineMenuExpand, OutlineMenuExpandRepositoryValue } from "./infra"

export const outlineMenuExpandRepositoryConverter: RepositoryConverter<
    OutlineMenuExpand,
    OutlineMenuExpandRepositoryValue
> = {
    toRepository: (value) => value,
    fromRepository: (value) => ({
        success: true,
        // label の配列なので、validation error にする手がかりがない
        value: value.map((labels) => labels.map(markOutlineMenuCategoryLabel)),
    }),
}

function markOutlineMenuCategoryLabel(label: string): OutlineMenuCategoryLabel {
    return label as OutlineMenuCategoryLabel
}
