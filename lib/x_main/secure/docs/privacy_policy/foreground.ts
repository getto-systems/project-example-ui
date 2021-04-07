import { render, h } from "preact"

import { docsFeature } from "../helper"

import { newDocsView } from "../../../../docs/action_docs/init"

import { docs_privacyPolicy } from "../../../../docs/docs"

import { DocsEntry } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView(docsFeature()),
        docs: {
            title: "プライバシーポリシー",
            contents: [[docs_privacyPolicy]],
        },
    }),
    document.body,
)
