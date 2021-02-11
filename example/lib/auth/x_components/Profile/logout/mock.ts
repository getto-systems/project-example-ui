import { MockComponent, MockPropsPasser } from "../../../../sub/getto-example/x_components/Application/mock"

import { LogoutComponent, LogoutComponentState } from "./component"

import { markSeason } from "../../../../example/shared/season/data"

export type ExampleMockPropsPasser = MockPropsPasser<ExampleMockProps>

export type ExampleMockProps =
    | Readonly<{ type: "success"; year: number }>
    | Readonly<{ type: "failed"; err: string }>

export function initMockExampleComponent(passer: ExampleMockPropsPasser): ExampleMockComponent {
    return new ExampleMockComponent(passer)
}

class ExampleMockComponent extends MockComponent<LogoutComponentState> implements LogoutComponent {
    constructor(passer: ExampleMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ExampleMockProps): LogoutComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-load", season: markSeason({ year: props.year }) }

                case "failed":
                    return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }
            }
        }
    }

    load() {
        // mock では特に何もしない
    }
}
