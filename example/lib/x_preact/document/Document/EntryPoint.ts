import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import { useTermination } from "../../common/hooks"
import { siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { Menu } from "../../common/Outline/Menu"
import { Content } from "./Content"

import { DocumentEntryPoint } from "../../../document/x_components/Document/EntryPoint/entryPoint"
import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

export function EntryPoint({ resource, terminate }: DocumentEntryPoint): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => resource.notify.send(err))
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: h(Content, resource),
        menu: h(Menu, resource),
    })
}
