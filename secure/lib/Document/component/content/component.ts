export interface ContentComponentFactory {
    (): ContentComponent
}

export interface ContentComponent {
    onStateChange(post: Post<ContentState>): void
}

export type ContentState = Readonly<{ type: "initial-content" }>

export const initialContentState: ContentState = { type: "initial-content" }

interface Post<T> {
    (state: T): void
}
