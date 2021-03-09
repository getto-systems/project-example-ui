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

import { ApplicationError } from "../../../common/x_preact/ApplicationError"
import { LoadSeason } from "../../common/action_load_season/x_preact/LoadSeason"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/LoadMenu"
import { LoadBreadcrumbList } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/LoadBreadcrumbList"
import { Example } from "../../common/action_load_season/x_preact/Example"

import { DashboardEntryPoint, DashboardResource } from "../entry_point"

export function Dashboard(entryPoint: DashboardEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(DashboardComponent, resource)
}
export function DashboardComponent(resource: DashboardResource): VNode {
    useDocumentTitle("ホーム")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(LoadSeason, resource)],
        main: appMain({
            header: mainHeader([mainTitle("ホーム"), h(LoadBreadcrumbList, resource)]),
            body: mainBody(h(Example, resource)),
            copyright: copyright(),
        }),
        menu: h(LoadMenu, resource),
    })
}
