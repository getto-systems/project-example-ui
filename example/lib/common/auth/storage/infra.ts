import { StorageError } from "./data"

export type StoreResult = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>
