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
import { useDocumentTitle } from "../../../x_preact/common/hooks"

import { copyright, siteInfo } from "../../../x_preact/common/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonComponent } from "../../../example/common/action_load_season/x_preact/load_season"
import { LoadMenu } from "../../../outline/menu/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/menu/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { Logout } from "../../sign/auth_ticket/action_logout/x_preact/logout"

import { ProfileEntryPoint, ProfileResource } from "../entry_point"

export function Profile(entryPoint: ProfileEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(ProfileComponent, resource)
}
export function ProfileComponent(props: ProfileResource): VNode {
    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(LoadSeasonComponent, props)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(LoadBreadcrumbListComponent, props)]),
            body: mainBody(h(Logout, props)),
            copyright: copyright(),
        }),
        menu: h(LoadMenu, props),
    })
}
