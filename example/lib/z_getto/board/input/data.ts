export const inputBoardValueTypes = [
    "text",
    "password",
    "search",
    "number",
    "tel",
    "email",
    "date",
    "time",
] as const
// variant 追加時 : typeof boardInputTypes[*] からの quick fix で展開できる
export type InputBoardValueType =
    | "number"
    | "text"
    | "password"
    | "search"
    | "tel"
    | "email"
    | "date"
    | "time"
