import { render, h } from "preact"

import { newDocument } from "../../common/Document/Document/mock"

import { Document } from "../../x_preact/common/Document/Document"

render(h(Document, { factory: newDocument() }), document.body)
