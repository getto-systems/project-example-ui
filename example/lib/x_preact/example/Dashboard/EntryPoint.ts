import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useDocumentTitle, useTermination } from "../../common/hooks"
import { copyright, siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { SeasonInfo } from "../../common/Outline/SeasonInfo"
import { Menu } from "../../common/Outline/Menu"
import { BreadcrumbList } from "../../common/Outline/BreadcrumbList"
import { Example } from "./Example"

import { DashboardEntryPoint } from "../../../example/x_components/Dashboard/EntryPoint/entryPoint"

export function EntryPoint({ resource, terminate }: DashboardEntryPoint): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => resource.notify.send(err))
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useDocumentTitle("ホーム")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(SeasonInfo, resource)],
        main: appMain({
            header: mainHeader([mainTitle("ホーム"), h(BreadcrumbList, resource)]),
            body: mainBody(h(Example, resource)),
            copyright: copyright(),
        }),
        menu: h(Menu, resource),
    })
}
