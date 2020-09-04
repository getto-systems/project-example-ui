import { LoadState } from "./data";

export interface ScriptAction {
    load(): LoadState;
}
