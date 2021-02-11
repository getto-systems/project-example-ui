import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import { useTermination } from "../../z_common/hooks"
import { siteInfo } from "../../z_common/site"

import { ApplicationError } from "../../z_common/System/ApplicationError"
import { MenuList } from "../../z_common/Outline/MenuList"
import { Content } from "./Content"

import { DocumentEntryPoint } from "../../../document/x_components/Document/EntryPoint/entryPoint"
import { appLayout } from "../../../z_vendor/getto-css/preact/layout/app"

type Props = DocumentEntryPoint
export function EntryPoint({ resource, terminate }: Props): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => resource.error.notify(err))
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: h(Content, resource),
        menu: h(MenuList, resource),
    })
}
