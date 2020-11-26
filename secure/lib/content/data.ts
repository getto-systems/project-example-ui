export type DocumentPath = "/docs/index.html"

export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>
