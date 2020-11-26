import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useComponentSet } from "../container"

import { ApplicationError } from "../system/application_error"
import { footer, menuHeader, menuFooter } from "../layout"

import { MenuList } from "../system/menu"
import { BreadcrumbList } from "../system/breadcrumb"

import { Content } from "./document/content"

import { DocumentComponentSet, DocumentFactory } from "../../Document/document/view"

type Props = {
    factory: DocumentFactory
}
export function Document({ factory }: Props): VNode {
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

    return h(View, container.components)
}
function View(components: DocumentComponentSet): VNode {
    useEffect(() => {
        document.title = `ドキュメント | ${document.title}`
    }, [])

    const title = html`ドキュメント`

    return html`
        <main class="layout">
            <article class="layout__main">
                <header class="main__header">
                    <h1 class="main__title">${title}</h1>
                    ${h(BreadcrumbList, components)}
                </header>
                <section class="main__body container">${h(Content, components)}</section>
                ${footer()}
            </article>
            ${menu()}
        </main>
    `

    function menu() {
        return html`
            <aside class="layout__menu menu">
                ${menuHeader()} ${h(MenuList, components)} ${menuFooter()}
            </aside>
        `
    }
}

const EMPTY_CONTENT = html``
