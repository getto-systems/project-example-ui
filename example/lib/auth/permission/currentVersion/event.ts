import { Version } from "./data";

export type FindCurrentVersionEvent =
    | Readonly<{ type: "succeed-to-find"; version: Version }>
