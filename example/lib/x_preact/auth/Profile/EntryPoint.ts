import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useDocumentTitle, useTermination } from "../../z_common/hooks"
import { copyright, siteInfo } from "../../z_common/site"

import { ApplicationError } from "../../z_common/System/ApplicationError"
import { SeasonInfo } from "../../z_common/Outline/SeasonInfo"
import { MenuList } from "../../z_common/Outline/MenuList"
import { BreadcrumbList } from "../../z_common/Outline/BreadcrumbList"
import { Logout } from "./Logout"

import { ProfileEntryPoint } from "../../../auth/z_EntryPoint/Profile/EntryPoint/entryPoint"

type Props = ProfileEntryPoint
export function EntryPoint({ resource, terminate }: Props): VNode {
    useTermination(terminate)

    const [err] = useErrorBoundary((err) => resource.error.notify(err))
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(SeasonInfo, resource)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(BreadcrumbList, resource)]),
            body: mainBody(h(Logout, resource)),
            copyright: copyright(),
        }),
        menu: h(MenuList, resource),
    })
}
