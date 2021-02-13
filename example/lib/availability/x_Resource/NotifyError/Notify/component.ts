import { Notify } from "../../../error/notify/action";

export interface NotifyComponentFactory {
    (material: NotifyMaterial): NotifyComponent
}
export type NotifyMaterial = Readonly<{
    notify: Notify
}>

export interface NotifyComponent {
    send(err: unknown): void
}
