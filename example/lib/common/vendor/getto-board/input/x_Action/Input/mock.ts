import { MockAction, MockPropsPasser } from "../../../../getto-example/Application/mock"
import { BoardValue, emptyBoardValue, markBoardValue } from "../../../kernel/data"
import { BoardInputType } from "../../data"
import { InputBoardAction, InputBoardState } from "./action"

export type InputBoardMockPropsPasser = MockPropsPasser<InputBoardMockProps>
export type InputBoardMockProps = Readonly<{ type: "initial"; value: string }>

export function initMockInputBoardAction(
    passer: InputBoardMockPropsPasser,
    type: BoardInputType
): InputBoardAction {
    return new Action(passer, type)
}

class Action extends MockAction<InputBoardState> implements InputBoardAction {
    readonly type: BoardInputType

    constructor(passer: InputBoardMockPropsPasser, type: BoardInputType) {
        super()
        this.type = type
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: InputBoardMockProps): InputBoardState {
            switch (props.type) {
                case "initial":
                    return {
                        type: "succeed-to-input",
                        value: markBoardValue(props.value),
                    }
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
