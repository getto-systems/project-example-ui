import { BreadcrumbList, Expansion } from "./data"
import { PagePathname } from "../location/data"

export interface NavigationAction {
    detectBreadcrumbList(pagePathname: PagePathname): BreadcrumbList
    loadNavigationList(pagePathname: PagePathname, expansion: Expansion): void
}
