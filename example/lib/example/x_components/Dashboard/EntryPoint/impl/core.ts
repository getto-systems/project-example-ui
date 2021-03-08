import { DashboardResource } from "../entryPoint"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { ExampleComponentFactory } from "../../example/component"

import { SeasonAction } from "../../../../shared/season/action"
import { NotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/resource"
import { LoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../../../../outline/menu/action_load_menu/resource"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }>
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory

        example: ExampleComponentFactory
    }>
}>
export function initDashboardResource(
    factory: DashboardFactory,
    breadcrumbList: LoadBreadcrumbListResource,
    menu: LoadMenuResource,
    error: NotifyUnexpectedErrorResource,
): DashboardResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        example: factory.components.example(actions),

        ...breadcrumbList,
        ...menu,
        ...error,
    }
}
