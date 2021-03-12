import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationEntryPoint } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../common/x_preact/hooks"

import { copyright, siteInfo } from "../../../common/x_preact/site"

import { ApplicationErrorComponent } from "../../../common/x_preact/application_error"
import { LoadSeasonComponent } from "../../common/action_load_season/x_preact/load_season"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { ExampleComponent } from "../../common/action_load_season/x_preact/example"

import { DashboardEntryPoint, DashboardResource } from "../entry_point"

export function Dashboard(entryPoint: DashboardEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DashboardComponent, resource)
}
export function DashboardComponent(resource: DashboardResource): VNode {
    useDocumentTitle("ホーム")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(LoadSeasonComponent, resource)],
        main: appMain({
            header: mainHeader([mainTitle("ホーム"), h(LoadBreadcrumbListComponent, resource)]),
            body: mainBody(h(ExampleComponent, resource)),
            copyright: copyright(),
        }),
        menu: h(LoadMenu, resource),
    })
}
