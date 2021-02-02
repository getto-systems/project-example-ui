import { LoadApiCredentialError } from "./data";

export type LoadResult<T> =
    | Readonly<{ success: false; err: LoadApiCredentialError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; content: T }>
