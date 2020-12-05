import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useEntryPoint } from "../../hooks"
import { footer, menuHeader, menuFooter } from "../../layout"

import { ApplicationError } from "../../System/ApplicationError"

import { SeasonInfo } from "../../common/Outline/SeasonInfo"
import { MenuList } from "../../common/Outline/MenuList"
import { BreadcrumbList } from "../../common/Outline/BreadcrumbList"

import { Example } from "./Example"

import { DashboardComponent, DashboardFactory } from "../../../document/Dashboard/Dashboard/view"

type Props = Readonly<{
    dashboard: DashboardFactory
}>
export function Dashboard({ dashboard }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const container = useEntryPoint(dashboard)

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(View, container.components)
}
function View(components: DashboardComponent): VNode {
    useEffect(() => {
        document.title = `ホーム | ${document.title}`
    }, [])

    const title = html`ホーム`

    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">${title}</h1>
                    ${h(BreadcrumbList, components)}
                </header>
                <section class="main__body container">${h(Example, components)}</section>
                ${footer()}
            </article>
            ${menu()}
        </main>
    `

    function menu() {
        return html`
            <aside class="layout__menu menu">
                ${menuHeader()} ${h(SeasonInfo, components)} ${h(MenuList, components)} ${menuFooter()}
            </aside>
        `
    }
}

const EMPTY_CONTENT = html``
