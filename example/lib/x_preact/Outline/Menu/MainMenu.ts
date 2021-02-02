import { h, VNode } from "preact"

import { appMenu, menuFooter, menuHeader } from "../../../z_external/getto-css/preact/layout/app"

import { siteInfo } from "../../common/site"

import { MenuList } from "../MenuList"
import { SeasonInfo } from "../SeasonInfo"

import { MenuListComponent } from "../../../auth/Outline/menuList/component"
import { SeasonInfoComponent } from "../../../example/Outline/seasonInfo/component"

type Props = Readonly<{
    menuList: MenuListComponent
    seasonInfo: SeasonInfoComponent
}>
export function MainMenu(props: Props): VNode {
    return appMenu([menuHeader(siteInfo()), h(SeasonInfo, props), h(MenuList, props), menuFooter()])
}
