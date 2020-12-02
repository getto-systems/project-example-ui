export type DocumentPath =
    | "/docs/index.html"
    | "/docs/development/deployment.html"
    | "/docs/development/auth.html"

export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>
