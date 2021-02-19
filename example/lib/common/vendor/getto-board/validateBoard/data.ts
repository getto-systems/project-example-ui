export type BoardValidateState = BoardValidateState_initial | "valid" | "invalid"
export const boardValidateState_initial = "initial" as const
export type BoardValidateState_initial = typeof boardValidateState_initial
