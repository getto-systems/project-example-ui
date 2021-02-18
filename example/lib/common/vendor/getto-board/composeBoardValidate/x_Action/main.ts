import { initComposeBoardValidateAction } from "./impl"

import { ComposeBoardValidateEmbed } from "../impl"

import { ComposeBoardValidateInfra } from "../infra"

import { ComposeBoardValidateAction } from "./action"

export function newComposeBoardValidateAction<N extends string>(
    embed: ComposeBoardValidateEmbed<N>,
    infra: ComposeBoardValidateInfra
): ComposeBoardValidateAction {
    return initComposeBoardValidateAction(embed, infra)
}
