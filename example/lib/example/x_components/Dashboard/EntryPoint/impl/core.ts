import { DashboardResource } from "../entryPoint"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { ExampleComponentFactory } from "../../example/component"

import { SeasonAction } from "../../../../shared/season/action"
import { MenuForegroundAction } from "../../../../../common/x_Resource/Outline/Menu/resource"
import { initMenuResource } from "../../../../../common/x_Resource/Outline/Menu/impl"
import { NotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/resource"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        MenuForegroundAction
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory

        example: ExampleComponentFactory
    }>
}>
export function initDashboardResource(
    factory: DashboardFactory,
    error: NotifyUnexpectedErrorResource,
): DashboardResource {
    const actions = {
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        seasonInfo: factory.components.seasonInfo(actions),

        example: factory.components.example(actions),

        ...initMenuResource(factory.actions),
        ...error,
    }
}
