import { MockComponent } from "../../../sub/getto-example/application/mock"
import { ContentComponent, ContentComponentState } from "./component"

export function initMockContentComponent(state: ContentComponentState): ContentMockComponent {
    return new ContentMockComponent(state)
}

export type ContentMockProps = Readonly<{ type: "success" }>

export function mapContentMockProps(props: ContentMockProps): ContentComponentState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", path: "/docs/index.html" }
    }
}

class ContentMockComponent extends MockComponent<ContentComponentState> implements ContentComponent {
    load(): void {
        // mock ではなにもしない
    }
}
