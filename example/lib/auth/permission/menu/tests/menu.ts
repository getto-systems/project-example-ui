import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../impl/core"

import {
    LoadBreadcrumbInfra,
    LoadMenuBadgeRemoteAccess,
    LoadMenuInfra,
    MenuExpandRepository,
    MenuTree,
    ToggleMenuExpandInfra,
} from "../infra"

import { MenuAction } from "../action"

export function initTestMenuAction(
    menuTree: MenuTree,
    menuExpands: MenuExpandRepository,
    remote: LoadMenuBadgeRemoteAccess
): MenuAction {
    return {
        loadBreadcrumb: loadBreadcrumb(loadBreadcrumbInfra()),
        loadMenu: loadMenu(loadMenuInfra()),
        toggleMenuExpand: toggleMenuExpand(toggleMenuExpandInfra()),
    }

    function loadBreadcrumbInfra(): LoadBreadcrumbInfra {
        return {
            menuTree,
        }
    }
    function loadMenuInfra(): LoadMenuInfra {
        return {
            menuTree,
            menuExpands,
            loadMenuBadge: remote,
        }
    }
    function toggleMenuExpandInfra(): ToggleMenuExpandInfra {
        return {
            menuExpands,
        }
    }
}
