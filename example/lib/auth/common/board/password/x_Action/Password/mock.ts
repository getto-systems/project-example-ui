import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockAction, MockPropsPasser } from "../../../../../../z_getto/application/mock"

import {
    PasswordBoardFieldAction,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardState,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

import { BoardConvertResult } from "../../../../../../z_getto/board/kernel/data"
import { Password } from "../../../../password/data"

export type PasswordBoardFieldActionMockPropsPasser = MockPropsPasser<
    PasswordBoardFieldActionMockProps
>
export type PasswordBoardFieldActionMockProps = PasswordBoardMockProps &
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

export function initMockPasswordBoardFieldAction(
    passer: PasswordBoardFieldActionMockPropsPasser
): PasswordBoardFieldAction {
    let characterState = { multiByte: false }
    passer.addPropsHandler((props) => {
        characterState = { multiByte: props.character === "multiByte" }
    })
    return {
        input: initMockInputBoardValueAction(),
        validate: new Action(passer),
        clear: () => null,
        toggle: new ToggleAction(passer),
        characterState: () => characterState,
    }
}

class Action extends MockAction<ValidatePasswordState> implements ValidatePasswordAction {
    readonly name = "password"

    constructor(passer: PasswordBoardFieldActionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => this.post(mapProps(props)))

        function mapProps(props: PasswordBoardMockProps): ValidatePasswordState {
            switch (props.type) {
                case "valid":
                    return { valid: true }

                case "empty":
                case "too-long":
                    return { valid: false, err: [props.type] }
            }
        }
    }

    get(): BoardConvertResult<Password> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}

class ToggleAction
    extends MockAction<TogglePasswordDisplayBoardState>
    implements TogglePasswordDisplayBoardAction {
    constructor(passer: PasswordBoardFieldActionMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => this.post(mapProps(props)))

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
