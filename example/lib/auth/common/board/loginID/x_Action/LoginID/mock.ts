import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockAction, MockPropsPasser } from "../../../../../../z_getto/application/mock"

import { LoginIDBoardFieldAction, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

import { LoginID } from "../../../../loginID/data"
import { BoardConvertResult } from "../../../../../../z_getto/board/kernel/data"

export type LoginIDBoardMockPropsPasser = MockPropsPasser<LoginIDBoardMockProps>
export type LoginIDBoardMockProps =
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "empty" }>
    | Readonly<{ type: "too-long" }>

export function initMockLoginIDBoardFieldAction(
    passer: LoginIDBoardMockPropsPasser
): LoginIDBoardFieldAction {
    return {
        validate: new Action(passer),
        input: initMockInputBoardValueAction(),
        clear: () => null,
    }
}

class Action extends MockAction<ValidateLoginIDState> implements ValidateLoginIDAction {
    readonly name = "loginID"

    constructor(passer: LoginIDBoardMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => this.post(mapProps(props)))

        function mapProps(props: LoginIDBoardMockProps): ValidateLoginIDState {
            switch (props.type) {
                case "valid":
                    return { valid: true }

                case "empty":
                case "too-long":
                    return { valid: false, err: [props.type] }
            }
        }
    }

    get(): BoardConvertResult<LoginID> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
