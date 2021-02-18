import { MockAction, MockPropsPasser } from "../../../getto-example/Application/mock"
import { ComposeBoardValidateAction, ComposeBoardValidateState } from "./action"

export type ComposeBoardValidateMockPropsPasser = MockPropsPasser<ComposeBoardValidateMockProps>
export type ComposeBoardValidateMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "invalid" }>

export function initMockComposeBoardValidateAction(
    passer: ComposeBoardValidateMockPropsPasser
): ComposeBoardValidateAction {
    return new Action(passer)
}

class Action extends MockAction<ComposeBoardValidateState> implements ComposeBoardValidateAction {
    constructor(passer: ComposeBoardValidateMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ComposeBoardValidateMockProps): ComposeBoardValidateState {
            return {
                type: "succeed-to-compose",
                state: props.type,
            }
        }
    }

    compose() {
        // mock では特に何もしない
    }
}
