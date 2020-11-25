import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useComponentSet } from "../container"

import { ApplicationError } from "../system/application_error"
import { footer, menuHeader, menuFooter } from "../layout"

import { SeasonInfo } from "../system/season"
import { MenuList } from "../system/menu"
import { BreadcrumbList } from "../system/breadcrumb"

import { Example } from "./dashboard/example"

import { DashboardComponentSet, DashboardResource } from "../../Home/dashboard/view"

type Props = {
    factory: Factory<DashboardResource>
}
export function Dashboard({ factory }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const container = useComponentSet(factory)

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(Content, container.components)
}
function Content(components: DashboardComponentSet): VNode {
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

interface Factory<T> {
    (): T
}
