import { toMenuCategory, toMenuItem } from "../../../kernel/infra"

import { LoadBreadcrumbListCoreAction } from "./action"

import { BreadcrumbList } from "../../data"

export function initMockLoadBreadcrumbListCoreAction(
    breadcrumbList: BreadcrumbList,
): LoadBreadcrumbListCoreAction {
    return {
        load: () => breadcrumbList,
    }
}

export function standard_MockBreadcrumbList(): BreadcrumbList {
    return initMockBreadcrumbList("ホーム")
}
export function initMockBreadcrumbList(label: string): BreadcrumbList {
    return [
        {
            type: "category",
            category: toMenuCategory({ label: "MAIN", permission: { type: "allow" } }),
        },
        {
            type: "item",
            item: toMenuItem({ icon: "home", label, path: "#" }, "1.0.0"),
        },
    ]
}
