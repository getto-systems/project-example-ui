import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import { loadMenu } from "../../load_menu/impl/core"
import { updateMenuBadge } from "../../update_menu_badge/impl/core"
import { toggleMenuExpand } from "../../toggle_menu_expand/impl/core"

import { FetchMenuResult, MenuStore } from "../../kernel/infra"
import { LoadMenuInfra } from "../../load_menu/infra"
import { UpdateMenuBadgeInfra } from "../../update_menu_badge/infra"
import { ToggleMenuExpandInfra } from "../../toggle_menu_expand/infra"

import {
    LoadMenuCoreMaterial,
    LoadMenuCoreAction,
    LoadMenuCoreState,
    initialLoadMenuCoreState,
    MenuStoreLinker,
} from "./action"

import { LoadMenuLocationDetecter } from "../../kernel/method"

import { MenuCategoryPath } from "../../kernel/data"

export type LoadMenuCoreInfra = LoadMenuInfra & UpdateMenuBadgeInfra & ToggleMenuExpandInfra

export function initLoadMenuCoreMaterial(
    infra: LoadMenuCoreInfra,
    detecter: LoadMenuLocationDetecter,
): LoadMenuCoreMaterial {
    return {
        load: loadMenu(infra)(detecter),
        updateBadge: updateMenuBadge(infra),
        toggle: toggleMenuExpand(infra),
    }
}

export function initLoadMenuCoreAction(material: LoadMenuCoreMaterial): LoadMenuCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<LoadMenuCoreState>
    implements LoadMenuCoreAction {
    readonly initialState = initialLoadMenuCoreState

    readonly storeLinker: MenuStoreLinker = {
        link: (store: MenuStore) => {
            this.link = { connect: true, store }
        },
        unlink: () => {
            this.link = { connect: false }
        },
    }
    link: MenuStoreLink = { connect: false }

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
                        setTimeout(() => this.updateBadge())
                }
            })
        })
        this.terminateHook(() => {
            this.storeLinker.unlink()
        })
    }

    fetch(state: LoadMenuCoreState): FetchMenuResult {
        return fetchMenu(state)
    }

    updateBadge(): void {
        const result = this.fetchMenu()
        if (!result.found) {
            return
        }
        this.material.updateBadge(result.value, this.post)
    }

    toggle(path: MenuCategoryPath): void {
        const result = this.fetchMenu()
        if (!result.found) {
            return
        }
        this.material.toggle(result.value, path, this.post)
    }

    fetchMenu(): FetchMenuResult {
        if (!this.link.connect) {
            this.post({ type: "failed-to-fetch-menu" })
            return { found: false }
        }
        const result = this.link.store.get()
        if (!result.found) {
            this.post({ type: "failed-to-fetch-menu" })
            return { found: false }
        }
        return result
    }
}

export function fetchMenu(state: LoadMenuCoreState): FetchMenuResult {
    switch (state.type) {
        case "initial-menu":
        case "failed-to-fetch-menu":
        case "required-to-login":
        case "repository-error":
            return { found: false }

        case "succeed-to-load":
        case "succeed-to-update":
        case "succeed-to-toggle":
        case "failed-to-update":
            return { found: true, value: state.menu }
    }
}

type MenuStoreLink = Readonly<{ connect: true; store: MenuStore }> | Readonly<{ connect: false }>
