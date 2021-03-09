import { h, VNode } from "preact"

import { useApplicationEntryPoint } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useNotifyUnexpectedError } from "../../../avail/action_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../common/x_preact/hooks"

import { copyright, siteInfo } from "../../../common/x_preact/site"

import { ApplicationError } from "../../../common/x_preact/ApplicationError"
import { LoadSeason } from "../../../example/common/action_load_season/x_preact/LoadSeason"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/LoadMenu"
import { LoadBreadcrumbList } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/LoadBreadcrumbList"
import { Logout } from "../../sign/kernel/auth_info/action_logout/x_preact/Logout"

import { ProfileEntryPoint, ProfileResource } from "../entryPoint"

export function Profile(entryPoint: ProfileEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(ProfileComponent, resource)
}
export function ProfileComponent(props: ProfileResource): VNode {
    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(LoadSeason, props)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(LoadBreadcrumbList, props)]),
            body: mainBody(h(Logout, props)),
            copyright: copyright(),
        }),
        menu: h(LoadMenu, props),
    })
}
