import { MockAction, MockPropsPasser } from "../../../../z_getto/application/mock"

import { AuthSignEntryPoint, AuthSignView, AuthSignViewState } from "./entryPoint"

export function initMockLoginEntryPointAsError(
    passer: LoginErrorMockPropsPasser,
): AuthSignEntryPoint {
    return {
        view: new MockErrorView(passer),
        terminate,
    }
}

export type LoginErrorMockPropsPasser = MockPropsPasser<LoginErrorMockProps>
export type LoginErrorMockProps = Readonly<{ error: string }>

class MockErrorView extends MockAction<AuthSignViewState> implements AuthSignView {
    constructor(passer: LoginErrorMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(err: LoginErrorMockProps): AuthSignViewState {
            return { type: "error", err: err.error }
        }
    }

    load(): void {
        // mock では特に何もしない
    }
}

function terminate() {
    // mock では特に何もしない
}
