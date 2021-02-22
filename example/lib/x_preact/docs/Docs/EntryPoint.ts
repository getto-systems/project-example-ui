import { h, VNode } from "preact"

import { useErrorNotify, useTermination_deprecated } from "../../common/hooks"
import { siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { Menu } from "../../common/Outline/Menu"
import { Content } from "./Content"

import { DocumentEntryPoint } from "../../../docs/x_components/Docs/EntryPoint/entryPoint"
import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

export function EntryPoint({ resource, terminate }: DocumentEntryPoint): VNode {
    useTermination_deprecated(terminate)

    const err = useErrorNotify(resource.notify)
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
