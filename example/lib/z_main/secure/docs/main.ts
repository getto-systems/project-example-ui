import { render, h } from "preact"

import { newDocumentAsSingle } from "../../../document/Document/Document/main"

import { Document } from "../../../x_preact/secure/Document/Document/Document"

render(h(Document, { document: newDocumentAsSingle() }), document.body)
