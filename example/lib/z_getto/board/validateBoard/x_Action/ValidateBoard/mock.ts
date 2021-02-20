import { MockAction, MockPropsPasser } from "../../../../application/mock"
import { BoardConvertResult } from "../../../kernel/data"
import { ValidateBoardAction, ValidateBoardState } from "./action"

export type ValidateBoardMockPropsPasser = MockPropsPasser<ValidateBoardMockProps>
export type ValidateBoardMockProps =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "invalid" }>

export function initMockValidateBoardAction<T>(
    passer: ValidateBoardMockPropsPasser
): ValidateBoardAction<T> {
    return new Action(passer)
}

class Action<T> extends MockAction<ValidateBoardState> implements ValidateBoardAction<T> {
    constructor(passer: ValidateBoardMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ValidateBoardMockProps): ValidateBoardState {
            return props.type
        }
    }

    get(): BoardConvertResult<T> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
