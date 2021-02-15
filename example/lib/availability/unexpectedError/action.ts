export type UnexpectedErrorAction = Readonly<{
    notifyUnexpectedError: NotifyUnexpectedErrorMethod
}>

export interface NotifyUnexpectedErrorPod {
    (): NotifyUnexpectedErrorMethod
}
export interface NotifyUnexpectedErrorMethod {
    (err: unknown): void
}
