import { DocumentTarget, LoadDocumentEvent } from "./data";

export interface LoadDocument {
    (collector: LoadDocumentCollector): LoadDocumentAction
}
export interface LoadDocumentAction {
    (post: Post<LoadDocumentEvent>): void
}
export type LoadDocumentCollector = DocumentTargetCollector

export interface DocumentTargetCollector {
    getDocumentTarget(): DocumentTarget
}

interface Post<T> {
    (event: T): void
}