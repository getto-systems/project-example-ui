import { ErrorAction } from "../../../error/action"

export interface NotifyComponentFactory {
    (material: NotifyMaterial): NotifyComponent
}
export type NotifyMaterial = Readonly<{
    error: ErrorAction
}>

export interface NotifyComponent {
    send(err: unknown): void
}
