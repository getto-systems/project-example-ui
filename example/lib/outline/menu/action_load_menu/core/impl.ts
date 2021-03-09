import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import { loadMenu } from "../../load_menu/impl/core"
import { updateMenuBadge } from "../../update_menu_badge/impl/core"
import { toggleMenuExpand } from "../../toggle_menu_expand/impl/core"

import { LoadMenuInfra, LoadMenuStore } from "../../load_menu/infra"
import { UpdateMenuBadgeInfra, UpdateMenuBadgeStore } from "../../update_menu_badge/infra"
import { ToggleMenuExpandInfra, ToggleMenuExpandStore } from "../../toggle_menu_expand/infra"

import {
    LoadMenuCoreMaterial,
    LoadMenuCoreAction,
    LoadMenuCoreState,
    initialLoadMenuCoreState,
} from "./action"

import { LoadMenuLocationDetecter } from "../../kernel/method"

import { MenuCategoryPath } from "../../kernel/data"
import { initMenuBadgeStore, initMenuExpandStore } from "../../kernel/infra/store"

export type LoadMenuCoreInfra = LoadMenuInfra & UpdateMenuBadgeInfra & ToggleMenuExpandInfra

type Store = LoadMenuStore & UpdateMenuBadgeStore & ToggleMenuExpandStore

export function initLoadMenuCoreMaterial(
    infra: LoadMenuCoreInfra,
    detecter: LoadMenuLocationDetecter,
): LoadMenuCoreMaterial {
    const store: Store = {
        menuExpand: initMenuExpandStore(),
        menuBadge: initMenuBadgeStore(),
    }
    return {
        load: loadMenu(infra, store)(detecter),
        updateBadge: updateMenuBadge(infra, store)(detecter),
        toggle: toggleMenuExpand(infra, store)(detecter),
    }
}

export function initLoadMenuCoreAction(material: LoadMenuCoreMaterial): LoadMenuCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<LoadMenuCoreState>
    implements LoadMenuCoreAction {
    readonly initialState = initialLoadMenuCoreState

    material: LoadMenuCoreMaterial

    constructor(material: LoadMenuCoreMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.load((event) => {
                this.post(event)

                switch (event.type) {
                    case "succeed-to-load":
                        // 初期ロード完了で最初の badge 更新を行う
                        this.updateBadge()
                }
            })
        })
    }

    updateBadge(): void {
        this.material.updateBadge(this.post)
    }

    toggle(path: MenuCategoryPath): void {
        this.material.toggle(path, this.post)
    }
}
