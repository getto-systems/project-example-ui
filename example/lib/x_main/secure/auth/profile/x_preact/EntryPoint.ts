import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../../../z_vendor/getto-css/preact/layout/app"

import { useDocumentTitle, useErrorNotify, useTermination } from "../../../../../x_preact/common/hooks"
import { copyright, siteInfo } from "../../../../../x_preact/common/site"

import { ApplicationError } from "../../../../../x_preact/common/System/ApplicationError"
import { SeasonInfo } from "../../../../../x_preact/common/Outline/SeasonInfo"
import { Menu } from "../../../../../x_preact/common/Outline/Menu"
import { BreadcrumbList } from "../../../../../x_preact/common/Outline/BreadcrumbList"
import { Logout } from "../../../../../auth/sign/kernel/authnInfo/clear/x_Action/Logout/x_preact/Logout"

import { AuthProfileEntryPoint } from "../entryPoint"

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
            body: mainBody(h(Logout, resource)),
            copyright: copyright(),
        }),
        menu: h(Menu, resource),
    })
}
