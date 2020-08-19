export interface ScriptAction {
    getPath(): ScriptPath;
}

export type Pathname = Readonly<string>;
export type ScriptPath = Readonly<string>;
