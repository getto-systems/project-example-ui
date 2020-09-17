import { PagePathname, ScriptPath, CheckError } from "../../script/data"

export type LoadApplicationComponentState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export const initialLoadApplicationComponentState: LoadApplicationComponentState = { type: "initial-load" }

export type LoadApplicationComponentOperation =
    Readonly<{ type: "load", pagePathname: PagePathname }>
