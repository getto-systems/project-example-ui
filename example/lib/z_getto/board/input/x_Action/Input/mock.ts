import { MockAction, MockPropsPasser } from "../../../../application/mock"
import { BoardValue, emptyBoardValue, markBoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"
import { InputBoardValueAction, InputBoardValueState } from "./action"

export type InputBoardMockPropsPasser = MockPropsPasser<InputBoardMockProps>
export type InputBoardMockProps = Readonly<{ type: "initial"; value: string }>

export function initMockInputBoardValueAction(
    passer: InputBoardMockPropsPasser,
    type: InputBoardValueType
): InputBoardValueAction {
    return new Action(passer, type)
}

class Action extends MockAction<InputBoardValueState> implements InputBoardValueAction {
    readonly type: InputBoardValueType

    constructor(passer: InputBoardMockPropsPasser, type: InputBoardValueType) {
        super()
        this.type = type
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: InputBoardMockProps): InputBoardValueState {
            switch (props.type) {
                case "initial":
                    return markBoardValue(props.value)
            }
        }
    }

    addInputHandler() {
        // mock では特に何もしない
    }

    get(): BoardValue {
        return emptyBoardValue
    }
    set() {
        // mock では特に何もしない
    }
    clear() {
        // mock では特に何もしない
    }
}
