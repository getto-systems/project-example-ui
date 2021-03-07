import { NotifyUnexpectedErrorAction } from "../../../unexpectedError/Action/action";

export interface NotifyComponentFactory {
    (material: NotifyMaterial): NotifyComponent
}
export type NotifyMaterial = Readonly<{
    error: NotifyUnexpectedErrorAction
}>

export interface NotifyComponent {
    send(err: unknown): void
}
