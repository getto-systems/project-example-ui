export type NotifyAction = Readonly<{
    notify: NotifyPod
}>

export interface NotifyPod {
    (): Notify
}
export interface Notify {
    (err: unknown): void
}
