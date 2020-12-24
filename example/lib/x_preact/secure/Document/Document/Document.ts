import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useEntryPoint } from "../../hooks"
import { footer, menuHeader, menuFooter } from "../../layout"

import { ApplicationError } from "../../../common/System/ApplicationError"
import { MenuList } from "../../Shared/Outline/MenuList"
import { Content } from "./Content"

import { DocumentComponent, DocumentFactory } from "../../../../document/Document/Document/view"

type Props = {
    document: DocumentFactory
}
export function Document({ document }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const container = useEntryPoint(document)

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(View, container.components)
}
function View(components: DocumentComponent): VNode {
    return html`
        <main class="layout">
            <article class="layout__main">${h(Content, components)} ${footer()}</article>
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
