import { MockAction, MockPropsPasser } from "../../../../z_getto/action/mock"
import { ContentComponent, ContentComponentState } from "./component"

export type ContentMockPropsPasser = MockPropsPasser<ContentMockProps>

export type ContentMockProps = Readonly<{ type: "success" }>

export function initMockContentComponent(passer: ContentMockPropsPasser): ContentMockComponent {
    return new ContentMockComponent(passer)
}

class ContentMockComponent extends MockAction<ContentComponentState> implements ContentComponent {
    readonly initialState: ContentComponentState = { type: "initial-content" }

    constructor(passer: ContentMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ContentMockProps): ContentComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-load", path: "/docs/index.html" }
            }
        }
    }

    load(): void {
        // mock ではなにもしない
    }
}
