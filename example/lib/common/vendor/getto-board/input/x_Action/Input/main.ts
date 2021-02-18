import { initInputBoardAction } from "./impl"

import { InputBoardEmbed } from "../../impl"

import { InputBoardInfra } from "../../infra"

import { InputBoardAction } from "./action"

export function newInputBoardAction<N extends string>(
    embed: InputBoardEmbed<N>,
    infra: InputBoardInfra
): InputBoardAction {
    return initInputBoardAction(embed, infra)
}
