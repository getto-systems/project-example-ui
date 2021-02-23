import { BoardValidateStack } from "../kernel/infra"

// TODO これ ValidateBoardInfra と同じなんだけど、一つになるかな？
export type ValidateBoardFieldInfra = Readonly<{
    stack: BoardValidateStack
}>
