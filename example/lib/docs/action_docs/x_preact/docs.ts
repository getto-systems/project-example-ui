import { h, VNode } from "preact"

import { useApplicationEntryPoint } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/common/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../../../x_preact/common/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { DocsContentComponent } from "./content"

import { DocsEntryPoint, DocsResource } from "../entry_point"

export function Docs(entryPoint: DocsEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DocsComponent, resource)
}

export function DocsComponent(resource: DocsResource): VNode {
    useDocumentTitle(resource.docs.title)

    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: appMain({
            header: mainHeader([
                mainTitle(resource.docs.title),
                h(LoadBreadcrumbListComponent, resource),
            ]),
            body: mainBody(h(DocsContentComponent, resource.docs)),
            copyright: copyright(),
        }),
        menu: h(LoadMenu, resource),
    })
}
