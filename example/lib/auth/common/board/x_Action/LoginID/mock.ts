import { initMockInputBoardAction } from "../../../../../common/vendor/getto-board/input/x_Action/Input/mock"
import {
    initMockPropsPasser,
    MockAction,
    MockPropsPasser,
} from "../../../../../common/vendor/getto-example/Application/mock"

import { LoginIDBoardResource, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

export type LoginIDBoardMockPropsPasser = MockPropsPasser<LoginIDBoardMockProps>
export type LoginIDBoardMockProps =
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "empty" }>
    | Readonly<{ type: "too-long" }>

export function initMockLoginIDBoardResource(
    passer: LoginIDBoardMockPropsPasser
): LoginIDBoardResource {
    return {
        validate: new Action(passer),
        input: initMockInputBoardAction(initMockPropsPasser(), "text"),
    }
}

class Action extends MockAction<ValidateLoginIDState> implements ValidateLoginIDAction {
    constructor(passer: LoginIDBoardMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: LoginIDBoardMockProps): ValidateLoginIDState {
            switch (props.type) {
                case "valid":
                    return { type: "initial-board", result: { valid: true } }

                case "empty":
                case "too-long":
                    return {
                        type: "succeed-to-validate",
                        result: { valid: false, err: [props.type] },
                    }
            }
        }
    }

    check() {
        // mock では特に何もしない
    }
}
