import { render, h } from "preact"

import { docsFeature } from "../../../helper"

import { newDocsView } from "../../../../../../docs/action_docs/init"

import { DocsEntry } from "../../../../../../docs/action_docs/x_preact/docs"

import {
    docs_auth_sign,
    docs_auth_sign_description,
    docs_auth_sign_explanation,
    docs_auth_sign_negativeNote,
} from "../../../../../../auth/action_sign/docs"

render(
    h(DocsEntry, {
        view: newDocsView(docsFeature()),
        docs: {
            title: "認証",
            contents: [
                [
                    [
                        ...docs_auth_sign,
                        ...docs_auth_sign_explanation,
                        ...docs_auth_sign_negativeNote,
                    ],
                ],
                ...docs_auth_sign_description,
            ],
        },
    }),
    document.body,
)
