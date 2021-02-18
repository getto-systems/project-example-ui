import { MockAction, MockPropsPasser } from "../../../../getto-example/Application/mock"

import { ValidateBoardAction, ValidateBoardState } from "./action"

export type ValidateBoardMockPropsPasser = MockPropsPasser<ValidateBoardMockProps>
export type ValidateBoardMockProps =
    | Readonly<{ type: "valid" }>
    | Readonly<{ type: "invalid"; err: string }>

export function initMockValidateBoardAction<E>(
    passer: ValidateBoardMockPropsPasser,
    map: ValidateBoardErrorMapper<E>
): ValidateBoardAction<E> {
    return new Action(passer, map)
}
export interface ValidateBoardErrorMapper<E> {
    (err: string): E
}

class Action<E> extends MockAction<ValidateBoardState<E>> implements ValidateBoardAction<E> {
    constructor(passer: ValidateBoardMockPropsPasser, map: ValidateBoardErrorMapper<E>) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: ValidateBoardMockProps): ValidateBoardState<E> {
            switch (props.type) {
                case "valid":
                    return {
                        type: "succeed-to-validate",
                        result: { success: true },
                    }

                case "invalid":
                    return {
                        type: "succeed-to-validate",
                        result: { success: false, err: [map(props.err)] },
                    }
            }
        }
    }

    check() {
        // mock では特に何もしない
    }
}
