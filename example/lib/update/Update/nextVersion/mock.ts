import { MockComponent } from "../../../sub/getto-example/application/mock"

import { NextVersionComponent, NextVersionState } from "./component"

export function initMockNextVersionComponent(state: NextVersionState): NextVersionMockComponent {
    return new NextVersionMockComponent(state)
}

export type NextVersionMockProps =
    | Readonly<{ type: "delayed" }>
    | Readonly<{ type: "failed"; err: string }>

export function mapNextVersionMockProps(props: NextVersionMockProps): NextVersionState {
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

class NextVersionMockComponent extends MockComponent<NextVersionState> implements NextVersionComponent {
    find(): void {
        // mock ではなにもしない
    }
}
