import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useTerminate } from "../../z_common/hooks"
import { copyright, siteInfo } from "../../z_common/site"

import { ApplicationError } from "../../z_common/System/ApplicationError"
import { SeasonInfo } from "../../z_common/Outline/SeasonInfo"
import { MenuList } from "../../z_common/Outline/MenuList"
import { BreadcrumbList } from "../../z_common/Outline/BreadcrumbList"
import { Logout } from "./Logout"

import { DashboardEntryPoint } from "../../../example/x_components/Dashboard/EntryPoint/entryPoint"

type Props = Readonly<{
    dashboard: DashboardEntryPoint
}>
export function Home({ dashboard: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    useEffect(() => {
        document.title = `プロフィール | ${document.title}`
    }, [])

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
