import { PagePathname, ScriptPath } from "../../script/data"

export type LoadApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export const initialLoadApplicationState: LoadApplicationState = { type: "initial-load" }

export type CheckError =
    Readonly<{ type: "not-found" }>

export type LoadApplicationComponentOperation =
    Readonly<{ type: "load", pagePathname: PagePathname }>
