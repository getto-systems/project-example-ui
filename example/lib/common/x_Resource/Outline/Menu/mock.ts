import { MockPropsPasser } from "../../../../z_getto/action/mock"

import { BreadcrumbListMockProps, initMockBreadcrumbListComponent } from "./BreadcrumbList/mock"
import { initMockMenuComponent, MenuMockProps } from "./Menu/mock"

import { MenuResource } from "./resource"

export type MenuResourceMockPropsPasser = MockPropsPasser<MenuResourceMockProps>
export type MenuResourceMockProps = BreadcrumbListMockProps & MenuMockProps

export function initMockMenuResource(passer: MenuResourceMockPropsPasser): MenuResource {
    return {
        breadcrumbList: initMockBreadcrumbListComponent(passer),
        menu: initMockMenuComponent(passer),
    }
}
