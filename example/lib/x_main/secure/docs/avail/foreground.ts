import { render, h } from "preact"

import { newDocsEntryPoint } from "../../../../docs/action_docs/init"

import { docs_avail, docs_avail_detail } from "../../../../avail/docs"

import { Docs } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(
        Docs,
        newDocsEntryPoint({
            webStorage: localStorage,
            currentLocation: location,
            docs: {
                title: "保守・運用",
                contents: [[[...docs_avail]], [docs_avail_detail]],
            },
        }),
    ),
    document.body,
)
