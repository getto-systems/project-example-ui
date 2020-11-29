import { render, h } from "preact"

import { newDocument } from "../../common/Document/Document/mock"

import { Document } from "../common/document/document"

render(h(Document, { factory: newDocument() }), document.body)
