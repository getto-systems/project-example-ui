import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { Example } from "./component/example"

import { SystemInfo } from "../system"
import { Breadcrumb } from "../menu/breadcrumb"
import { Nav } from "../menu"

import { mainFooter, menuHeader, menuFooter } from "../layout"

import { BreadcrumbComponent, BreadcrumbParam } from "../../menu/breadcrumb/component"

import { ExampleComponent, ExampleParam } from "../../home/component/example/component"

type Props = Readonly<{
    breadcrumb: {
        component: BreadcrumbComponent
        param: BreadcrumbParam
    },
    example: {
        component: ExampleComponent
        param: ExampleParam
    }
}>

export function Dashboard(props: Props): VNode {
    useEffect(() => {
        document.title = `ホーム | ${document.title}`
    }, [])

    const mainTitle = html`ホーム`

    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">${mainTitle}</h1>
                    ${h(Breadcrumb, props.breadcrumb)}
                </header>
                <section class="main__body container">
                    ${h(Example, props.example)}
                </section>
                ${mainFooter()}
            </article>
            <aside class="layout__menu menu">
                ${menuHeader()}
                <nav id="menu" class="menu__body">
                    ${h(SystemInfo, {})}
                    ${h(Nav, {})}
                </nav>
                ${menuFooter("DEVELOPMENT" /* TODO これはコンポーネントになる、のかな？ */)}
            </aside>
        </main>
    `
}
