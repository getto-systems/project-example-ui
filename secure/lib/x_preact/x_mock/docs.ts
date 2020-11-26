import { render, h } from "preact"

import { newDocument } from "../../Document/document/main/mock"

import { Document } from "../document/document"

render(h(Document, { factory: newDocument() }), document.body)
