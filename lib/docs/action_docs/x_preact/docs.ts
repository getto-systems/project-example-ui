import { h, VNode } from "preact"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../../../example/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { docsArticle } from "./content"

import { DocsView, DocsResource } from "../resource"
import { DocsSection } from "../../../z_vendor/getto-application/docs/data"

export type DocsContent = Readonly<{
    title: string
    contents: DocsSection[][][]
}>

type EntryProps = Readonly<{
    view: DocsView
    docs: DocsContent
}>
export function DocsEntry(props: EntryProps): VNode {
    const resource = useApplicationView(props.view)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DocsComponent, { ...resource, docs: props.docs })
}

type Props = DocsResource & Readonly<{ docs: DocsContent }>
export function DocsComponent(resource: Props): VNode {
    useDocumentTitle(resource.docs.title)

    return appLayout({
        siteInfo,
        header: [],
        main: appMain({
            header: mainHeader([
                mainTitle(resource.docs.title),
                h(LoadBreadcrumbListComponent, resource),
            ]),
            body: mainBody(docsArticle(resource.docs.contents)),
            copyright,
        }),
        menu: h(LoadMenuEntry, resource),
    })
}
