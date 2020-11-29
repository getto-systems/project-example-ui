import { render, h } from "preact"

import { newDocumentAsMock } from "../../common/Document/Document/mock"

import { Document } from "../../x_preact/common/Document/Document"

render(h(Document, { factory: newDocumentAsMock() }), document.body)
