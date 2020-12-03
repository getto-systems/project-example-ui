export type DocumentPath =
    | "/docs/index.html"
    | "/docs/auth.html"
    | "/docs/development/deployment.html"
    | "/docs/development/auth/login.html"

export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; path: DocumentPath }>
