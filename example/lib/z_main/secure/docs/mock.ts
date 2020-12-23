import { render, h } from "preact"

import { newDocumentAsMock } from "../../../document/Document/Document/mock"

import { Document } from "../../../x_preact/secure/Document/Document/Document"

render(h(Document, { document: newDocumentAsMock() }), document.body)
