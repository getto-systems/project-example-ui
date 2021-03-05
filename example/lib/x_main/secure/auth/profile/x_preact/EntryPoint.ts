import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../../../z_vendor/getto-css/preact/layout/app"

import {
    useDocumentTitle,
    useEntryPoint,
    useErrorNotify,
} from "../../../../../x_preact/common/hooks"
import { copyright, siteInfo } from "../../../../../x_preact/common/site"

import { ApplicationError } from "../../../../../x_preact/common/System/ApplicationError"
import { SeasonInfo } from "../../../../../x_preact/common/Outline/SeasonInfo"
import { Menu } from "../../../../../x_preact/common/Outline/Menu"
import { BreadcrumbList } from "../../../../../x_preact/common/Outline/BreadcrumbList"
import { Logout } from "../../../../../auth/sign/kernel/authInfo/clear/Action/x_preact/Logout"

import { AuthProfileEntryPoint, AuthProfileResource } from "../entryPoint"

export function EntryPoint(entryPoint: AuthProfileEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

    const err = useErrorNotify(resource.notify)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(View, <AuthProfileProps>resource)
}

export type AuthProfileProps = AuthProfileResource
export function View(props: AuthProfileProps): VNode {
    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(SeasonInfo, props)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(BreadcrumbList, props)]),
            body: mainBody(h(Logout, props)),
            copyright: copyright(),
        }),
        menu: h(Menu, props),
    })
}
