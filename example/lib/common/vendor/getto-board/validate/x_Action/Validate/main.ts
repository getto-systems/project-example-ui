import { initValidateBoardAction } from "./impl"

import { ValidateBoardEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction } from "./action"

export function newValidateBoardAction<N extends string, E>(
    embed: ValidateBoardEmbed<N, E>,
    infra: ValidateBoardInfra
): ValidateBoardAction<E> {
    return initValidateBoardAction(embed, infra)
}
