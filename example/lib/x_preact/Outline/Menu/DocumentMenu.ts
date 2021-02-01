import { h, VNode } from "preact"

import { appMenu, menuFooter, menuHeader } from "../../../z_external/getto-css/preact/layout/app"

import { siteInfo } from "../../common/site"

import { MenuList } from "../MenuList"

import { MenuListComponent } from "../../../auth/Outline/menuList/component"

type Props = Readonly<{
    menuList: MenuListComponent
}>
export function DocumentMenu(props: Props): VNode {
    return appMenu([menuHeader(siteInfo()), h(MenuList, props), menuFooter()])
}
