import { h, VNode } from "preact"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import { copyright, siteInfo } from "../../../example/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonComponent } from "../../../example/common/action_load_season/x_preact/load_season"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { LogoutEntry } from "../../auth_ticket/action_logout/x_preact/logout"

import { ProfileView, ProfileResource } from "../resource"

export function ProfileEntry(view: ProfileView): VNode {
    const resource = useApplicationView(view)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(ProfileComponent, resource)
}
export function ProfileComponent(props: ProfileResource): VNode {
    useDocumentTitle("プロフィール")

    return appLayout({
        siteInfo,
        header: [h(LoadSeasonComponent, props)],
        main: appMain({
            header: mainHeader([mainTitle("プロフィール"), h(LoadBreadcrumbListComponent, props)]),
            body: mainBody(h(LogoutEntry, props)),
            copyright,
        }),
        menu: h(LoadMenuEntry, props),
    })
}
