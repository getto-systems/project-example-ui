import { initTestSeasonAction } from "../../../../shared/season/tests/season"

import { DashboardFactory, initDashboardResource } from "../impl/core"

import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initExampleComponent } from "../../example/impl"

import { SeasonRepository } from "../../../../shared/season/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"

import { DashboardResource } from "../entryPoint"
import { standard_MockLoadBreadcrumbListResource } from "../../../../../outline/menu/loadBreadcrumbList/Action/mock"
import { standard_MockLoadMenuResource } from "../../../../../outline/menu/loadMenu/Action/mock"
import { standard_MockNotifyUnexpectedErrorResource } from "../../../../../avail/unexpectedError/Action/mock"

export type DashboardRepository = Readonly<{
    seasons: SeasonRepository
}>
export function newTestDashboardResource(
    repository: DashboardRepository,
    clock: Clock,
): DashboardResource {
    const factory: DashboardFactory = {
        actions: {
            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }

    return initDashboardResource(
        factory,
        standard_MockLoadBreadcrumbListResource(),
        standard_MockLoadMenuResource(),
        standard_MockNotifyUnexpectedErrorResource(),
    )
}
