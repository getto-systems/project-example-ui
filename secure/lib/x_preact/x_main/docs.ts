import { render, h } from "preact"

import { newDocumentComponentSetFactoryAsSingle } from "../../Document/document/main/core"

import { Document } from "../document/document"

render(h(Document, { factory: newDocumentComponentSetFactoryAsSingle(location) }), document.body)
