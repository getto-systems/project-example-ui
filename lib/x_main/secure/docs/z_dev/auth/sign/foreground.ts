import { render, h } from "preact"
import {
    docs_auth_sign,
    docs_auth_sign_description,
    docs_auth_sign_explanation,
    docs_auth_sign_negativeNote,
} from "../../../../../../auth/action_sign/docs"

import { newDocsView } from "../../../../../../docs/action_docs/init"

import { DocsEntry } from "../../../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView({
            webStorage: localStorage,
            webCrypto: crypto,
            currentLocation: location,
        }),
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
