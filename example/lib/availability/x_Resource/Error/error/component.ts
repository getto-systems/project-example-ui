import { Notify } from "../../../notify/action";

export interface ErrorComponentFactory {
    (material: ErrorMaterial): ErrorComponent
}
export type ErrorMaterial = Readonly<{
    notify: Notify
}>

export interface ErrorComponent {
    notify(err: unknown): void
}
