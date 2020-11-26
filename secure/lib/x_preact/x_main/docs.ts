import { render, h } from "preact"

import { newDocumentAsSingle } from "../../Document/document/main/core"

import { Document } from "../document/document"

render(
    h(Document, { factory: newDocumentAsSingle(localStorage, location) }),
    document.body
)
