import { MockComponent } from "../../../sub/getto-example/application/mock"

import { ExampleComponent, ExampleComponentState } from "./component"

import { markSeason } from "../../shared/season/data"

export function initMockExampleComponent(state: ExampleComponentState): ExampleMockComponent {
    return new ExampleMockComponent(state)
}

export type ExampleMockProps =
    | Readonly<{ type: "success"; year: number }>
    | Readonly<{ type: "failed"; err: string }>

export function mapExampleMockProps(props: ExampleMockProps): ExampleComponentState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", season: markSeason({ year: props.year }) }

        case "failed":
            return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }
    }
}

class ExampleMockComponent extends MockComponent<ExampleComponentState> implements ExampleComponent {
    load() {
        // mock では特に何もしない
    }
}
