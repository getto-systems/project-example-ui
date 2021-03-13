import { h, VNode } from "preact"

import { useApplicationEntryPoint } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_unexpected_error/x_preact/hooks"

import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

import { siteInfo } from "../../../x_preact/common/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/load_menu"
import { LoadDocsContentPathComponent } from "../../action_load_content/x_preact/load_docs_content_path"

import { DocsContentEntryPoint, DocsContentResource } from "../entry_point"

export function DocsContent(entryPoint: DocsContentEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
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
