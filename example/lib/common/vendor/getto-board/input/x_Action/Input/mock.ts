import { MockAction, MockPropsPasser } from "../../../../getto-example/Application/mock"
import { markBoardValue } from "../../../kernel/data"
import { InputBoardAction, InputBoardState } from "./action"

export type InputBoardMockPropsPasser = MockPropsPasser<InputBoardMockProps>
export type InputBoardMockProps = Readonly<{ type: "initial"; value: string }>

export function initMockInputBoardAction(passer: InputBoardMockPropsPasser): InputBoardAction {
    return new Action(passer)
}

class Action extends MockAction<InputBoardState> implements InputBoardAction {
    constructor(passer: InputBoardMockPropsPasser) {
        super()
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

    set() {
        // mock では特に何もしない
    }
    clear() {
        // mock では特に何もしない
    }
}
