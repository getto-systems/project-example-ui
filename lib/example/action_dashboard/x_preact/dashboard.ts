import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import { copyright, siteInfo } from "../../site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonComponent } from "../../common/action_load_season/x_preact/load_season"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { ExampleComponent } from "../../common/action_load_season/x_preact/example"

import { DashboardView, DashboardResource } from "../resource"

export function DashboardEntry(view: DashboardView): VNode {
    const resource = useApplicationView(view)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DashboardComponent, resource)
}
export function DashboardComponent(resource: DashboardResource): VNode {
    useDocumentTitle("ホーム")

    return appLayout({
        siteInfo,
        header: [h(LoadSeasonComponent, resource)],
        main: appMain({
            header: mainHeader([mainTitle("ホーム"), h(LoadBreadcrumbListComponent, resource)]),
            body: mainBody(h(ExampleComponent, resource)),
            copyright,
        }),
        menu: h(LoadMenuEntry, resource),
    })
}
