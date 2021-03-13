import { html } from "htm/preact"
import { VNode } from "preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"

import { v_small } from "../../../z_vendor/getto-css/preact/design/alignment"
import { box, container } from "../../../z_vendor/getto-css/preact/design/box"
import {
    label_alert,
    label_pending,
    notice_info,
} from "../../../z_vendor/getto-css/preact/design/highlight"
import { field } from "../../../z_vendor/getto-css/preact/design/form"

import { icon } from "../../../x_preact/common/design/icon"

import {
    DocsAction,
    DocsActionContent,
    DocsActionTarget,
    DocsContent,
    DocsDescription,
    DocsExplanation,
    DocsNegativeNote,
    DocsSection,
} from "../../../z_vendor/getto-application/docs/data"

type Props = Readonly<{
    contents: DocsSection[][]
}>
export function DocsComponent(props: Props): VNode {
    return paddingVSpace(
        props.contents.map((sections) =>
            container(
                sections.map((section) =>
                    box({
                        title: sectionTitle(section),
                        body: paddingVSpace(section.body.map(sectionBody), v_small()),
                    }),
                ),
            ),
        ),
        v_small(),
    )

    function paddingVSpace(contents: VNodeContent[], space: VNode): VNode {
        return html`${pad()}`

        function pad(): VNodeContent[] {
            return contents.reduce((acc, content) => {
                if (acc.length > 0) {
                    acc.push(space)
                }
                acc.push(content)
                return acc
            }, <VNodeContent[]>[])
        }
    }
}

function sectionTitle(section: DocsSection): VNodeContent {
    switch (section.type) {
        case "normal":
            return section.title

        case "pending":
            return html`${section.title} ${label_pending("あとで")}`
    }
}
function sectionBody(content: DocsContent): VNodeContent {
    switch (content.type) {
        case "purpose":
            return purpose(content.content)

        case "module":
            return module(content.content)

        case "item":
            return item(content.title, content.content)

        case "description":
            return description(content.content)

        case "explanation":
            return explanation(content.content)

        case "negativeNote":
            return negativeNote(content.content)

        case "action":
            return action(content.content)

        case "note":
            return note(content.content)
    }
}

function purpose(content: string[]): VNodeContent {
    return content.map(notice_info)
}
function module(content: string[]): VNodeContent {
    // TODO section.paragraph 的なやつにしたい（p には ul 要素を入れられなかった気がする）
    return html`<p><ul>${content.map(li)}</ul></p>`

    function li(message: string): VNode {
        return html`<li>${message}</li>`
    }
}
function item(title: string, content: string[]): VNodeContent {
    // TODO section.paragraph 的なやつにしたい（p には ul 要素を入れられなかった気がする）
    return [html`<p>${title}</p>`, html`<p><ul>${content.map(li)}</ul></p>`]

    function li(message: string): VNode {
        return html`<li>${icon("chevron-right")} ${message}</li>`
    }
}
function description(contents: DocsDescription[]): VNodeContent {
    return contents.map((content) =>
        field({
            title: content.title,
            body: body(content.body),
            help: content.help,
        }),
    )

    function body(messages: string[]): VNodeContent {
        return html`<ul>
            ${messages.map(li)}
        </ul>`

        function li(message: string): VNode {
            return html`<li>${message}</li>`
        }
    }
}
function explanation(contents: DocsExplanation[]): VNodeContent {
    return contents.map(
        (content) => html`<p>
            ${icon(content.icon)} ${content.label}<br />
            （${content.help}）
        </p>`,
    )
}
function negativeNote(contents: DocsNegativeNote[]): VNodeContent {
    return contents.map(
        (content) => html`<p>
            ${icon("close")} ${content.message}<br />
            （${content.help}）
        </p>`,
    )
}
function action(contents: DocsAction[]): VNodeContent {
    return contents.map(action)

    function action(action: DocsAction): VNode {
        return field({
            title: title(),
            body: body(action.content.body),
            help: action.content.help,
        })

        function title(): VNodeContent {
            switch (action.type) {
                case "request":
                    return html`${target(action.content.from)} ${icon("arrow-right")}
                    ${target(action.content.to)}`

                case "action":
                    return target(action.content.on)
            }

            function target(target: DocsActionTarget): VNode {
                switch (target) {
                    case DocsActionTarget["content-server"]:
                        return icon("database")

                    case DocsActionTarget["api-server"]:
                        return icon("cogs")

                    case DocsActionTarget["http-client"]:
                        return icon("display")

                    case DocsActionTarget["text-client"]:
                        return icon("envelope")
                }
            }
        }
        function body(contents: DocsActionContent[]): VNodeContent {
            return contents.map((content) => {
                switch (content.type) {
                    case "normal":
                        return content.message

                    case "validate":
                        return html`${label_alert("検証")} ${content.message}`
                }
            })
        }
    }
}
function note(contents: string[]): VNodeContent {
    // TODO section.paragraph 的なやつにしたい（p には ul 要素を入れられなかった気がする）
    return html`<hr /><p><ul>${contents.map(li)}</ul></p>`

    function li(content: string): VNode {
        return html`<li>${content}</li>`
    }
}
