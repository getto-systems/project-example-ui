import {
    MockComponent,
    MockPropsPasser,
} from "../../../../common/getto-example/Application/mock"

import { NextVersionComponent, NextVersionComponentState } from "./component"

export type NextVersionMockPropsPasser = MockPropsPasser<NextVersionMockProps>
export type NextVersionMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "failed"; err: string }>

export function initMockNextVersionComponent(passer: NextVersionMockPropsPasser): NextVersionComponent {
    return new NextVersionMockComponent(passer)
}

class NextVersionMockComponent
    extends MockComponent<NextVersionComponentState>
    implements NextVersionComponent {
    constructor(passer: NextVersionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: NextVersionMockProps): NextVersionComponentState {
            switch (props.type) {
                case "delayed":
                    return { type: "delayed-to-find" }

                case "failed":
                    return {
                        type: "failed-to-find",
                        err: { type: "failed-to-check", err: { type: "infra-error", err: props.err } },
                    }
            }
        }
    }

    find(): void {
        // mock ではなにもしない
    }
}
