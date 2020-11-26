import { render, h } from "preact"

import { newDocument } from "../../common/Document/document/main/mock"

import { Document } from "../common/document/document"

render(h(Document, { factory: newDocument() }), document.body)
