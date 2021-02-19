import { initMockInputBoardAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/mock"
import {
    initMockPropsPasser,
    MockAction,
    MockPropsPasser,
} from "../../../../../../common/vendor/getto-example/Application/mock"

import {
    PasswordBoardResource,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardState,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

export type PasswordBoardResourceMockPropsPasser = MockPropsPasser<PasswordBoardResourceMockProps>
export type PasswordBoardResourceMockProps = PasswordBoardMockProps &
    TogglePasswordDisplayBoardMockProps &
    PasswordCharacterStateMockProps

type PasswordBoardMockProps =
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "empty" }>
    | Readonly<{ type: "too-long" }>

type TogglePasswordDisplayBoardMockProps =
    | Readonly<{ display: "hide" }>
    | Readonly<{ display: "show" }>
export const passwordDisplayBoardTypes: TogglePasswordDisplayBoardMockProps["display"][] = [
    "hide",
    "show",
]

type PasswordCharacterStateMockProps =
    | Readonly<{ character: "singleByte" }>
    | Readonly<{ character: "multiByte" }>
export const passwordCharacterStateTypes: PasswordCharacterStateMockProps["character"][] = [
    "singleByte",
    "multiByte",
]

export function initMockPasswordBoardResource(
    passer: PasswordBoardResourceMockPropsPasser
): PasswordBoardResource {
    let characterState = { multiByte: false }
    passer.addPropsHandler((props) => {
        characterState = { multiByte: props.character === "multiByte" }
    })
    return {
        validate: new Action(passer),
        input: initMockInputBoardAction(initMockPropsPasser(), "password"),
        toggle: new ToggleAction(passer),
        characterState: () => characterState,
    }
}

class Action extends MockAction<ValidatePasswordState> implements ValidatePasswordAction {
    constructor(passer: PasswordBoardResourceMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: PasswordBoardMockProps): ValidatePasswordState {
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

class ToggleAction
    extends MockAction<TogglePasswordDisplayBoardState>
    implements TogglePasswordDisplayBoardAction {
    constructor(passer: PasswordBoardResourceMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(
            props: TogglePasswordDisplayBoardMockProps
        ): TogglePasswordDisplayBoardState {
            switch (props.display) {
                case "show":
                    return { visible: true }

                case "hide":
                    return { visible: false }
            }
        }
    }

    show() {
        // mock では特に何もしない
    }
    hide() {
        // mock では特に何もしない
    }
}
