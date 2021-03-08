import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

// Menu の expand 状態は UI に保存したいので、例外的に action から infra を参照している
import { FetchMenuResult, MenuStore } from "../../../kernel/infra"

import { LoadMenuMethod } from "../../method"
import { UpdateMenuBadgeMethod } from "../../../updateMenuBadge/method"
import { ToggleMenuExpandMethod } from "../../../toggleMenuExpand/method"

import { LoadMenuEvent } from "../../event"
import { UpdateMenuBadgeEvent } from "../../../updateMenuBadge/event"
import { ToggleMenuExpandEvent } from "../../../toggleMenuExpand/event"

import { MenuCategoryPath } from "../../../kernel/data"

export interface LoadMenuCoreAction extends ApplicationStateAction<LoadMenuCoreState> {
    readonly storeLinker: MenuStoreLinker

    fetch(state: LoadMenuCoreState): FetchMenuResult
    updateBadge(): void
    toggle(path: MenuCategoryPath): void
}
export interface MenuStoreLinker {
    link(store: MenuStore): void
    unlink(): void
}

export type LoadMenuCoreMaterial = Readonly<{
    load: LoadMenuMethod
    updateBadge: UpdateMenuBadgeMethod
    toggle: ToggleMenuExpandMethod
}>

export type LoadMenuCoreState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "failed-to-fetch-menu" }>
    | LoadMenuEvent
    | UpdateMenuBadgeEvent
    | ToggleMenuExpandEvent

export const initialLoadMenuCoreState: LoadMenuCoreState = { type: "initial-menu" }
