export type DocumentTarget = DocumentPath & { DocumentTarget: never }
export function markDocumentTarget(path: DocumentPath): DocumentTarget {
    return path as DocumentTarget
}

export type DocumentPath = "/docs/index.html"

export type LoadDocumentEvent = Readonly<{ type: "succeed-to-load"; target: DocumentTarget }>
