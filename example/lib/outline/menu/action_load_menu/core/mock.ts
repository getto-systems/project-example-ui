import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/mock"

import {
    appendMenuCategoryPath,
    FetchMenuResult,
    toMenuCategory,
    toMenuItem,
} from "../../kernel/infra"

import { Menu } from "../../kernel/data"

import {
    initialLoadMenuCoreState,
    LoadMenuCoreAction,
    LoadMenuCoreState,
    MenuStoreLinker,
} from "./action"
import { fetchMenu } from "./impl"

export function initMockLoadMenuCoreAction(menu: Menu): LoadMenuCoreAction {
    return new Action(menu)
}

class Action extends ApplicationMockStateAction<LoadMenuCoreState> implements LoadMenuCoreAction {
    readonly initialState = initialLoadMenuCoreState

    readonly storeLinker: MenuStoreLinker = {
        link: () => null,
        unlink: () => null,
    }

    constructor(menu: Menu) {
        super()
        this.addMockIgniter(() => ({ type: "succeed-to-load", menu }))
    }

    fetch(state: LoadMenuCoreState): FetchMenuResult {
        return fetchMenu(state)
    }

    updateBadge() {
        // mock では特に何もしない
    }
    toggle() {
        // mock では特に何もしない
    }
}

export function standard_MockMenu(): Menu {
    return initMockMenu("ホーム", "lnir lnir-home", 10)
}
export function initMockMenu(label: string, icon: string, badgeCount: number): Menu {
    const category = { label: "MAIN", permission: { type: "allow" } } as const
    return [
        {
            type: "category",
            isExpand: true,
            badgeCount,
            category: toMenuCategory(category),
            path: appendMenuCategoryPath([], category),
            children: [
                {
                    type: "item",
                    isActive: true,
                    badgeCount,
                    item: toMenuItem(
                        {
                            label,
                            icon,
                            path: "/index.html",
                        },
                        "1.0.0",
                    ),
                },
            ],
        },
    ]
}
