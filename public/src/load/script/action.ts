import { ScriptPath } from "./data";

export interface ScriptAction {
    getPath(): Promise<ScriptPath>;
}
