import { render, h } from "preact"

import { newDocumentComponentSetFactory } from "../../Document/document/main/mock"

import { Document } from "../document/document"

render(h(Document, { factory: newDocumentComponentSetFactory() }), document.body)
