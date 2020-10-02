// TODO この定義はたぶんもっと適切な場所がある
export type MenuSearch = Readonly<{
    // TODO menu の開閉状態だけどこの定義はこれでいいのか？
    expansion: Record<string, string>
}>

export type PagePathname = { PagePathname: never }

export type FetchResponse<T> =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>

export type StoreEvent =
    Readonly<{ type: "failed-to-store", err: StoreError }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>
