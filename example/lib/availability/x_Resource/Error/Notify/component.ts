import { UnexpectedErrorAction } from "../../../unexpectedError/action"

export interface NotifyComponentFactory {
    (material: NotifyMaterial): NotifyComponent
}
export type NotifyMaterial = Readonly<{
    error: UnexpectedErrorAction
}>

export interface NotifyComponent {
    send(err: unknown): void
}
