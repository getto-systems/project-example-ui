import { h, VNode } from "preact"

import { useApplicationEntryPoint } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_unexpected_error/x_preact/hooks"

import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

import { siteInfo } from "../../../common/x_preact/site"

import { ApplicationError } from "../../../common/x_preact/ApplicationError"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/LoadMenu"
import { LoadDocsContentPathComponent } from "../../action_load_content/x_preact/LoadDocsContentPath"

import { DocsContentEntryPoint, DocsContentResource } from "../entry_point"

export function DocsContent(entryPoint: DocsContentEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(DocsContentComponent, resource)
}

export function DocsContentComponent(resource: DocsContentResource): VNode {
    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: h(LoadDocsContentPathComponent, resource),
        menu: h(LoadMenu, resource),
    })
}
