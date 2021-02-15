export type ErrorAction = Readonly<{
    notify: NotifyMethod
}>

export interface NotifyPod {
    (): NotifyMethod
}
export interface NotifyMethod {
    (err: unknown): void
}
