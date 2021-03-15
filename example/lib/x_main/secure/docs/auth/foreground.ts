import { render, h } from "preact"

import { newDocsEntryPoint } from "../../../../docs/action_docs/init"

import { docs_auth, docs_auth_detail, docs_auth_summary } from "../../../../auth/docs"

import { Docs } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(
        Docs,
        newDocsEntryPoint({
            webStorage: localStorage,
            currentLocation: location,
            docs: {
                title: "認証・認可",
                contents: [[[...docs_auth, ...docs_auth_summary]], ...docs_auth_detail],
            },
        }),
    ),
    document.body,
)
