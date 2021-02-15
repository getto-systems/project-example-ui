import { DashboardResource } from "../entryPoint"

import { SeasonInfoComponentFactory } from "../../../Outline/seasonInfo/component"
import { ExampleComponentFactory } from "../../example/component"

import { SeasonAction } from "../../../../shared/season/action"
import { NotifyComponentFactory } from "../../../../../availability/x_Resource/NotifyError/Notify/component"
import { NotifyAction } from "../../../../../availability/error/notify/action"
import { MenuForegroundAction } from "../../../../../common/x_Resource/Outline/Menu/resource"
import { initMenuResource } from "../../../../../common/x_Resource/Outline/Menu/impl"

export type DashboardFactory = Readonly<{
    actions: Readonly<{
        notify: NotifyAction
        season: SeasonAction
    }> &
        MenuForegroundAction
    components: Readonly<{
        error: NotifyComponentFactory
        seasonInfo: SeasonInfoComponentFactory

        example: ExampleComponentFactory
    }>
}>
export function initDashboardResource(factory: DashboardFactory): DashboardResource {
    const actions = {
        notify: factory.actions.notify.notify(),
        loadSeason: factory.actions.season.loadSeason(),
    }
    return {
        error: factory.components.error(actions),
        seasonInfo: factory.components.seasonInfo(actions),

        example: factory.components.example(actions),

        ...initMenuResource(factory.actions),
    }
}
