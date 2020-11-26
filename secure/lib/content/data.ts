export type DocumentPath =
    | "/docs/index.html"
    | "/docs/server.html"
    | "/docs/detail/server.html"
    | "/docs/auth.html"
    | "/docs/detail/auth.html"

export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>
