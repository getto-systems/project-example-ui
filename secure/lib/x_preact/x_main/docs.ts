import { render, h } from "preact"

import { newDocumentAsSingle } from "../../common/Document/Document/main"

import { Document } from "../common/Document/Document"

render(
    h(Document, { factory: newDocumentAsSingle(localStorage, location) }),
    document.body
)
