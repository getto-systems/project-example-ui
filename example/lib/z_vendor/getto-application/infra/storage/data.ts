export type StorageError = Readonly<{ type: "infra-error"; err: string }>

export type StoreResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: StorageError }>
