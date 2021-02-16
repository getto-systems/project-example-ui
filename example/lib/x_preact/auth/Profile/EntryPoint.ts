import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useDocumentTitle, useErrorNotify, useTermination } from "../../common/hooks"
import { copyright, siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { SeasonInfo } from "../../common/Outline/SeasonInfo"
import { Menu } from "../../common/Outline/Menu"
import { BreadcrumbList } from "../../common/Outline/BreadcrumbList"
import { AuthProfileLogout } from "./Logout"

import { AuthProfileEntryPoint } from "../../../auth/z_EntryPoint/Profile/entryPoint"

export function EntryPoint({ resource, terminate }: AuthProfileEntryPoint): VNode {
    useTermination(terminate)

    const err = useErrorNotify(resource.notify)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(SeasonInfo, resource)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(BreadcrumbList, resource)]),
            body: mainBody(h(AuthProfileLogout, resource)),
            copyright: copyright(),
        }),
        menu: h(Menu, resource),
    })
}
