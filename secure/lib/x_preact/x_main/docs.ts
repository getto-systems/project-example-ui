import { render, h } from "preact"

import { newDocumentAsSingle } from "../../common/Document/document/main/core"

import { Document } from "../common/document/document"

render(
    h(Document, { factory: newDocumentAsSingle(localStorage, location) }),
    document.body
)
