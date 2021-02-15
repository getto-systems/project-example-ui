import { MockComponent, MockPropsPasser } from "../../../../../../vendor/getto-example/Application/mock"

import { ClearAuthCredentialComponent, ClearAuthCredentialComponentState } from "./component"

export type ClearAuthCredentialMockPropsPasser = MockPropsPasser<
    ClearAuthCredentialMockProps
>

export type ClearAuthCredentialMockProps = Readonly<{ type: "failed"; err: string }>

export function initMockClearAuthCredentialComponent(
    passer: ClearAuthCredentialMockPropsPasser
): Component {
    return new Component(passer)
}

class Component
    extends MockComponent<ClearAuthCredentialComponentState>
    implements ClearAuthCredentialComponent {
    constructor(passer: ClearAuthCredentialMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(
            props: ClearAuthCredentialMockProps
        ): ClearAuthCredentialComponentState {
            switch (props.type) {
                case "failed":
                    return { type: "failed-to-logout", err: { type: "infra-error", err: props.err } }
            }
        }
    }

    submit() {
        // mock では特に何もしない
    }
}
