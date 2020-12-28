import { MockComponent } from "../../../z_external/mock/component"
import { ContentComponent, ContentState } from "./component"

export function initContentComponent(state: ContentState): ContentMockComponent {
    return new ContentMockComponent(state)
}

export type ContentMockProps = Readonly<{ type: "success" }>

export function mapContentMockProps(props: ContentMockProps): ContentState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", path: "/docs/index.html" }
    }
}

class ContentMockComponent extends MockComponent<ContentState> implements ContentComponent {
    load(): void {
        // mock ではなにもしない
    }
}
