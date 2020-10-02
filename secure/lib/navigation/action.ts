import { BreadcrumbList } from "./data"
import { PagePathname } from "../location/data"

export interface NavigationAction {
    detect(pagePathname: PagePathname): BreadcrumbList
}
