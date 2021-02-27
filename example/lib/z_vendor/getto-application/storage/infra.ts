import { StorageError } from "./data"

export type StoreResult = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>

export interface StorageItem {
    get(): StorageItemFetchResult
    set(value: string): void
    remove(): void
}

export type StorageItemFetchResult =
    | Readonly<{ found: false }>
    | Readonly<{ found: true; value: string }>
