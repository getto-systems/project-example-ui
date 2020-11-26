import { DocumentPath, LoadDocumentEvent } from "./data";

export interface LoadDocument {
    (collector: LoadDocumentCollector): LoadDocumentAction
}
export interface LoadDocumentAction {
    (post: Post<LoadDocumentEvent>): void
}
export type LoadDocumentCollector = DocumentPathCollector

export interface DocumentPathCollector {
    getDocumentPath(): DocumentPath
}

interface Post<T> {
    (event: T): void
}