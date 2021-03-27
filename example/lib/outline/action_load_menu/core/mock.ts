import { ApplicationMockStateAction } from "../../../z_vendor/getto-application/action/mock"

import { Menu } from "../../kernel/data"
import { appendMenuCategoryPath, toMenuCategory, toMenuItem } from "../../kernel/impl/converter"

import { initialLoadMenuCoreState, LoadMenuCoreAction, LoadMenuCoreState } from "./action"

export function mockLoadMenuCoreAction(menu: Menu): LoadMenuCoreAction {
    return new Action(menu)
}

class Action extends ApplicationMockStateAction<LoadMenuCoreState> implements LoadMenuCoreAction {
    readonly initialState = initialLoadMenuCoreState

    constructor(menu: Menu) {
        super()
        this.addMockIgniter(() => ({ type: "succeed-to-load", menu }))
    }

    updateBadge() {
        // mock では特に何もしない
    }
    show() {
        // mock では特に何もしない
    }
    hide() {
        // mock では特に何もしない
    }
}

export function mockMenu_home(): Menu {
    return mockMenu("ホーム", "lnir lnir-home", 10)
}
export function mockMenu(label: string, icon: string, badgeCount: number): Menu {
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
                    item: toMenuItem({ label, icon, path: "/index.html" }, "1.0.0"),
                },
            ],
        },
    ]
}
