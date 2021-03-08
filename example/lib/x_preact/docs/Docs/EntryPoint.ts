import { h, VNode } from "preact"

import { useNotifyUnexpectedError } from "../../../avail/action_unexpected_error/x_preact/hooks"

import { useTermination_deprecated } from "../../common/hooks"
import { siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/LoadMenu"
import { Content } from "./Content"

import { DocumentEntryPoint } from "../../../docs/x_components/Docs/EntryPoint/entryPoint"
import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

export function EntryPoint({ resource, terminate }: DocumentEntryPoint): VNode {
    useTermination_deprecated(terminate)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: h(Content, resource),
        menu: h(LoadMenu, resource),
    })
}
