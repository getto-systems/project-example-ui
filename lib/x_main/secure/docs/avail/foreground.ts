import { render, h } from "preact"

import { newDocsView } from "../../../../docs/action_docs/init"

import { docs_avail, docs_avail_detail } from "../../../../avail/docs"

import { DocsEntry } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView({
            webStorage: localStorage,
            webCrypto: crypto,
            currentLocation: location,
        }),
        docs: {
            title: "保守・運用",
            contents: [[[...docs_avail]], [docs_avail_detail]],
        },
    }),
    document.body,
)