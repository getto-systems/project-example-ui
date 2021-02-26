import { InputBoardValueType } from "../data";
import { InputBoardValueAction } from "./Core/action";

export type InputBoardValueResource = Readonly<{
    type: InputBoardValueType
    input: InputBoardValueAction
}>
