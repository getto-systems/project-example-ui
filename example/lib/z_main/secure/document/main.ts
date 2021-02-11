import { render, h } from "preact"

import { newDocumentAsSingle } from "../../../document/x_components/Document/Document/main/single"

import { Document } from "../../../x_preact/Document/Document"

render(h(Document, { document: newDocumentAsSingle() }), document.body)
