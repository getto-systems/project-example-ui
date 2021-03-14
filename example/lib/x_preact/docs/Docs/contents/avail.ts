import { h, VNode } from "preact"

import { DocsComponent } from "../../../../docs/kernel/x_preact/docs"

import {
    docs_avail,
    docs_avail_access,
    docs_avail_cost,
    docs_avail_error,
    docs_avail_update,
} from "../../../../avail/docs"

export const content_development_deployment = (): VNode[] => [
    h(DocsComponent, {
        contents: [
            [...docs_avail],
            [...docs_avail_access, ...docs_avail_cost, ...docs_avail_update, ...docs_avail_error],
        ],
    }),
]
