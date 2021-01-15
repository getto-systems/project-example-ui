import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useTerminate } from "../../common/hooks"
import { mainFooter, menuHeader, menuFooter } from "../../common/layout"

import { ApplicationError } from "../../common/System/ApplicationError"
import { SeasonInfo } from "../../Outline/SeasonInfo"
import { MenuList } from "../../Outline/MenuList"
import { BreadcrumbList } from "../../Outline/BreadcrumbList"
import { Example } from "./Example"

import { DashboardEntryPoint } from "../../../example/Home/Dashboard/view"

type Props = Readonly<{
    dashboard: DashboardEntryPoint
}>
export function Dashboard({ dashboard: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    useEffect(() => {
        document.title = `ホーム | ${document.title}`
    }, [])

    const title = html`ホーム`

    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">${title}</h1>
                    ${h(BreadcrumbList, resource)}
                </header>
                <section class="main__body container">${h(Example, resource)}</section>
                ${mainFooter()}
            </article>
            <aside class="layout__menu menu">
                ${menuHeader()} ${h(SeasonInfo, resource)} ${h(MenuList, resource)} ${menuFooter()}
            </aside>
        </main>
    `
}
