import { render, h } from "preact"

import { newDocumentAsSingle } from "../../common/Document/Document/main"

import { Document } from "../../x_preact/common/Document/Document"

render(h(Document, { factory: newDocumentAsSingle() }), document.body)
