import { BoardValidateStackFound } from "../kernel/infra"
import { BoardValidateState } from "./data"
import { ComposeBoardValidateInfra } from "./infra"
import { ComposeBoardValidateMethod } from "./method"

export type ComposeBoardValidateEmbed<N extends string> = Readonly<{
    fields: N[]
}>

interface Compose {
    <N extends string>(embed: ComposeBoardValidateEmbed<N>): {
        (infra: ComposeBoardValidateInfra): ComposeBoardValidateMethod
    }
}
export const composeBoardValidate: Compose = (embed) => (infra) => (post) => {
    const { fields } = embed
    const { stack } = infra

    post({
        type: "succeed-to-compose",
        state: compose(fields.map((field) => stack.get(field))),
    })
}

function compose(results: BoardValidateStackFound[]): BoardValidateState {
    if (results.some((result) => result.found && !result.state)) {
        return "invalid"
    }
    if (results.some((result) => !result.found)) {
        return "initial"
    }
    return "valid"
}
