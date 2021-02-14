import { MockComponent, MockPropsPasser } from "../../../../vendor/getto-example/Application/mock"

import { SeasonInfoComponent, SeasonInfoComponentState } from "./component"

import { markSeason } from "../../../shared/season/data"

export type SeasonInfoMockPropsPasser = MockPropsPasser<SeasonInfoMockProps>
export type SeasonInfoMockProps =
    | Readonly<{ type: "success"; year: number }>
    | Readonly<{ type: "failed"; err: string }>

export function initMockSeasonInfoComponent(passer: SeasonInfoMockPropsPasser): SeasonInfoMockComponent {
    return new SeasonInfoMockComponent(passer)
}

class SeasonInfoMockComponent
    extends MockComponent<SeasonInfoComponentState>
    implements SeasonInfoComponent {
    constructor(passer: SeasonInfoMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: SeasonInfoMockProps): SeasonInfoComponentState {
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
