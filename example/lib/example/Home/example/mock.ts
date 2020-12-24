import { MockComponent } from "../../../z_external/mock/component"

import { ExampleComponent, ExampleState } from "./component"

import { markSeason } from "../../shared/season/data"

export function initExample(state: ExampleState): ExampleMockComponent {
    return new ExampleMockComponent(state)
}

export type ExampleMockProps =
    | Readonly<{ type: "success"; year: number }>
    | Readonly<{ type: "failed"; err: string }>

export function mapExampleMockProps(props: ExampleMockProps): ExampleState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", season: markSeason({ year: props.year }) }

        case "failed":
            return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }
    }
}

class ExampleMockComponent extends MockComponent<ExampleState> implements ExampleComponent {
    load() {
        // mock では特に何もしない
    }
}
