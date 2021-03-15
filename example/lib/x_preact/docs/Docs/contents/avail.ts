import { h, VNode } from "preact"

import { DocsContentComponent } from "../../../../docs/action_docs/x_preact/content"

import { docs_avail, docs_avail_detail } from "../../../../avail/docs"

export const content_development_deployment = (): VNode[] => [
    h(DocsContentComponent, {
        contents: [[[...docs_avail]], [docs_avail_detail]],
    }),
]
