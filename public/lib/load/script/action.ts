import { LoadedScript } from "./data";

export interface ScriptAction {
    load(): Promise<LoadedScript>;
}
